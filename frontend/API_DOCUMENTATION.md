# Muncho Food Delivery API Documentation

## API Workflow & How to Use

The Muncho API orchestrates an end-to-end food ordering and delivery system across three core user roles: **Customer**, **Restaurant Owner**, and **Delivery Worker**. 

1. **Authentication & RBAC**: Every request (except public restaurant/dish browsing and auth) is authenticated using a Bearer token received from `/api/auth/login` or `/api/auth/register`. The token embeds the user's role (`CUSTOMER`, `RESTAURANT_OWNER`, or `DELIVERY_WORKER`), which the backend strictly validates against protected endpoints.
2. **Customer Flow**: The customer browses restaurants (`GET /api/restaurants`) and menus (`GET /api/restaurants/{id}`), checks item availability, and previews cart pricing (`POST /api/customer/checkout/preview`) to review subtotal, taxes, delivery fees, and the final total. They then place the order (`POST /api/customer/orders`). Order items capture snapshots of item names and prices at the moment of checkout, ensuring historic accuracy even if menus change later.
3. **Restaurant Owner Flow**: The restaurant owner views new orders (`GET /api/owner/restaurants/{id}/orders`), accepts the order, and updates its preparation status (`ACCEPTED` -> `PREPARING` -> `READY_FOR_PICKUP`). The owner can then query available delivery couriers (`GET /api/owner/delivery-workers/eligible`) and assign a worker (`POST /api/owner/orders/{id}/assign-delivery`).
4. **Delivery Worker Flow**: The assigned worker checks their active deliveries (`GET /api/delivery/orders`), picks up the order and marks it `OUT_FOR_DELIVERY`, and then marks it either `DELIVERED` or `FAILED` (which mandates a `failureReason`). All status transitions are immediately reflected across customer, restaurant, and delivery views.

---

## Quick Start & Database

### 1. Start the Database
From the root directory (`muncho/`), start the PostgreSQL container:
```bash
docker compose up -d
```
- **Host Port**: `5433` (mapped to PostgreSQL standard `5432` inside container)
- **Database**: `munchodb`
- **Username**: `postgres`
- **Password**: `postgres`

### 2. Run the Backend
From the `backend` directory:
```bash
./gradlew bootRun
```
The server will start on `http://localhost:8080`.

---

## Pre-Seeded Accounts

The application automatically seeds the database on first startup with pre-configured users and restaurants:

| Role | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@muncho.com` | `password123` | Alice Customer |
| **Restaurant Owner** | `owner@muncho.com` | `password123` | Bob Owner (owns *Muncho Burger Hub* & *Bella Trattoria*) |
| **Delivery Worker** | `driver@muncho.com` | `password123` | Charlie Driver |
| **Delivery Worker 2** | `driver2@muncho.com` | `password123` | Diana Courier |

---

## Authentication Endpoints

### 1. Register User
`POST /api/auth/register` (Public)

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "password123",
  "fullName": "Jane Doe",
  "phone": "+1-555-0199",
  "role": "CUSTOMER"
}
```
*Roles supported*: `CUSTOMER`, `RESTAURANT_OWNER`, `DELIVERY_WORKER`.

### 2. Login User
`POST /api/auth/login` (Public)

**Request Body:**
```json
{
  "email": "customer@muncho.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": 1,
    "email": "customer@muncho.com",
    "fullName": "Alice Customer",
    "phone": "+1-555-0101",
    "role": "CUSTOMER",
    "available": true
  }
}
```

### 3. Get Current Profile
`GET /api/auth/me` (Authenticated)

**Headers:** `Authorization: Bearer <token>`

---

## Public & Customer Browsing Endpoints

### 1. List Available Restaurants
`GET /api/restaurants` (Public)
- Optional query parameter: `?search=burger`

### 2. View Restaurant & Menu
`GET /api/restaurants/{id}` (Public)

### 3. List All Dishes
`GET /api/dishes` (Public)
- Optional query parameter: `?search=truffle`

### 4. View Dish Details
`GET /api/dishes/{id}` (Public)

---

## Customer Ordering Endpoints
*Requires `ROLE_CUSTOMER`* (Header: `Authorization: Bearer <customer_token>`)

### 1. Checkout Preview
`POST /api/customer/checkout/preview`

Calculates live order summary, subtotal, 5% tax, $5.00 delivery fee, and final total before placing order.

**Request Body:**
```json
{
  "restaurantId": 1,
  "items": [
    { "dishId": 1, "quantity": 2 },
    { "dishId": 3, "quantity": 1 }
  ]
}
```

**Response (200 OK):**
```json
{
  "restaurantId": 1,
  "restaurantName": "Muncho Burger Hub",
  "items": [
    {
      "dishId": 1,
      "dishName": "Classic Smash Cheeseburger",
      "unitPrice": 9.99,
      "quantity": 2,
      "subtotal": 19.98
    },
    {
      "dishId": 3,
      "dishName": "Truffle Parmesan Fries",
      "unitPrice": 4.99,
      "quantity": 1,
      "subtotal": 4.99
    }
  ],
  "subtotal": 24.97,
  "deliveryFee": 5.00,
  "tax": 1.25,
  "discount": 0.00,
  "totalAmount": 31.22
}
```

### 2. Place Order
`POST /api/customer/orders`

Validates item availability, enforces duplicate order protection (rejects identical orders submitted within 30s), saves price snapshots, and initializes status to `PLACED`.

**Request Body:**
```json
{
  "restaurantId": 1,
  "items": [
    { "dishId": 1, "quantity": 2 },
    { "dishId": 3, "quantity": 1 }
  ],
  "deliveryAddress": "742 Evergreen Terrace, Springfield",
  "customerPhone": "+1-555-9876",
  "paymentMethod": "CARD"
}
```

### 3. Customer Order History
`GET /api/customer/orders`

### 4. Customer Order Details
`GET /api/customer/orders/{id}`

---

## Restaurant Owner Endpoints
*Requires `ROLE_RESTAURANT_OWNER`* (Header: `Authorization: Bearer <owner_token>`)

### 1. Create Restaurant
`POST /api/owner/restaurants`
```json
{
  "name": "Taco Fiesta",
  "description": "Authentic Mexican cantina",
  "cuisine": "Mexican",
  "address": "789 Salsa Blvd",
  "phone": "+1-555-TACO",
  "operatingHours": "11:00 AM - 10:00 PM",
  "available": true
}
```

### 2. View My Restaurants
`GET /api/owner/restaurants`

### 3. Update Restaurant Details & Availability
- `PUT /api/owner/restaurants/{id}`: Update restaurant details
- `PATCH /api/owner/restaurants/{id}/availability`: `{ "available": false }`

### 4. Menu Management
- `POST /api/owner/restaurants/{restaurantId}/dishes`: Add dish
  ```json
  {
    "name": "Birria Tacos (3 pcs)",
    "description": "Slow-cooked beef with consomme broth",
    "price": 13.99,
    "category": "Tacos",
    "available": true,
    "preparationTimeMinutes": 12
  }
  ```
- `PUT /api/owner/dishes/{dishId}`: Update dish details / price / availability
- `DELETE /api/owner/dishes/{dishId}`: Delete dish

### 5. Restaurant Orders
- `GET /api/owner/restaurants/{restaurantId}/orders`: List orders for restaurant
- `GET /api/owner/orders/{orderId}`: View order details

### 6. Order Status Progression
`PATCH /api/owner/orders/{orderId}/status`
- Permitted status transitions:
  - `PLACED` -> `ACCEPTED` or `REJECTED`
  - `ACCEPTED` -> `PREPARING`
  - `PREPARING` -> `READY_FOR_PICKUP`

**Request Body:**
```json
{
  "status": "ACCEPTED"
}
```

### 7. Delivery Assignment
- `GET /api/owner/delivery-workers/eligible`: View list of active delivery workers
- `POST /api/owner/orders/{orderId}/assign-delivery`:
  ```json
  {
    "deliveryWorkerId": 3
  }
  ```

---

## Delivery Worker Endpoints
*Requires `ROLE_DELIVERY_WORKER`* (Header: `Authorization: Bearer <driver_token>`)

### 1. View Assigned Deliveries
`GET /api/delivery/orders`

### 2. View Delivery Order Details
`GET /api/delivery/orders/{orderId}`

### 3. Update Delivery Status
`PATCH /api/delivery/orders/{orderId}/status`

- **Mark Out for Delivery:**
  ```json
  {
    "status": "OUT_FOR_DELIVERY"
  }
  ```
- **Mark Delivered:**
  ```json
  {
    "status": "DELIVERED"
  }
  ```
- **Mark Failed (requires failureReason):**
  ```json
  {
    "status": "FAILED",
    "failureReason": "Customer not answering intercom and phone number disconnected."
  }
  ```

---

## Shared Order Endpoint
`GET /api/orders/{id}`

Accessible by any authenticated user who is either the customer, the restaurant owner, or the assigned delivery worker. Returns `403 Forbidden` for unrelated users.

---

## Order Status State Machine

```
[PLACED]
   �
   +-- (Owner rejects) -------> [REJECTED] (Payment refunded if prepaid)
   �
   +-- (Owner accepts) -------> [ACCEPTED]
                                   �
                                   ?
                              [PREPARING]
                                   �
                                   ?
                           [READY_FOR_PICKUP]
                                   �  (Driver assigned)
                                   ?
                           [OUT_FOR_DELIVERY]
                                   �
                     +---------------------------+
                     ?                           ?
                [DELIVERED]                   [FAILED]
           (Cash marked paid)        (Requires failureReason)
```
