# Muncho Backend — Data Model UML & Relationship Specification

This document provides the UML Class Diagram, Entity-Relationship (ER) Diagram, and detailed structural specifications for all entities and relationships in the **Muncho Backend** application (`com.muncho.backend.model`).

---

## 1. UML Class Diagram (Mermaid)

```mermaid
classDiagram
    direction TB

    class Role {
        <<enumeration>>
        CUSTOMER
        RESTAURANT_OWNER
        DELIVERY_WORKER
    }

    class OrderStatus {
        <<enumeration>>
        PLACED
        ACCEPTED
        REJECTED
        PREPARING
        READY_FOR_PICKUP
        OUT_FOR_DELIVERY
        DELIVERED
        FAILED
        CANCELLED
    }

    class PaymentStatus {
        <<enumeration>>
        PENDING
        PAID
        FAILED
        REFUNDED
    }

    class PaymentMethod {
        <<enumeration>>
        CARD
        CASH
        UPI
    }

    class User {
        +Long id
        +String email
        +String password
        +String fullName
        +String phone
        +Role role
        +boolean available
        +LocalDateTime createdAt
        #onCreate() void
    }

    class Restaurant {
        +Long id
        +String name
        +String description
        +String cuisine
        +String address
        +String phone
        +String imageUrl
        +String operatingHours
        +boolean available
        +User owner
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        #onCreate() void
        #onUpdate() void
    }

    class Dish {
        +Long id
        +Restaurant restaurant
        +String name
        +String description
        +BigDecimal price
        +String imageUrl
        +String category
        +boolean available
        +Integer preparationTimeMinutes
        +LocalDateTime createdAt
        #onCreate() void
    }

    class Order {
        +Long id
        +String orderNumber
        +User customer
        +Restaurant restaurant
        +User deliveryWorker
        +OrderStatus status
        +PaymentStatus paymentStatus
        +PaymentMethod paymentMethod
        +String deliveryAddress
        +String customerPhone
        +BigDecimal subtotal
        +BigDecimal deliveryFee
        +BigDecimal tax
        +BigDecimal discount
        +BigDecimal totalAmount
        +String failureReason
        +List~OrderItem~ items
        +LocalDateTime createdAt
        +LocalDateTime updatedAt
        #onCreate() void
        #onUpdate() void
    }

    class OrderItem {
        +Long id
        +Order order
        +Dish dish
        +String dishName
        +BigDecimal unitPrice
        +int quantity
        +BigDecimal subtotal
    }

    %% Associations & Multiplicity
    User "1" --> "0..*" Restaurant : owns
    Restaurant "1" --> "0..*" Dish : offers
    User "1" --> "0..*" Order : places
    User "0..1" --> "0..*" Order : delivers
    Restaurant "1" --> "0..*" Order : fulfills
    Order "1" *-- "1..*" OrderItem : contains
    Dish "0..1" <-- "0..*" OrderItem : references

    %% Enumeration Usages
    User ..> Role
    Order ..> OrderStatus
    Order ..> PaymentStatus
    Order ..> PaymentMethod
```

---

## 2. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ RESTAURANTS : "owns (owner_id)"
    USERS ||--o{ ORDERS : "places (customer_id)"
    USERS |o--o{ ORDERS : "delivers (delivery_worker_id)"
    RESTAURANTS ||--o{ DISHES : "offers (restaurant_id)"
    RESTAURANTS ||--o{ ORDERS : "fulfills (restaurant_id)"
    ORDERS ||--|{ ORDER_ITEMS : "contains (order_id)"
    DISHES |o--o{ ORDER_ITEMS : "references (dish_id)"

    USERS {
        bigint id PK
        varchar email UK "nullable=false, unique"
        varchar password "nullable=false"
        varchar full_name "nullable=false"
        varchar phone "nullable=true"
        varchar role "nullable=false, enum"
        boolean available "default=true"
        timestamp created_at "updatable=false"
    }

    RESTAURANTS {
        bigint id PK
        bigint owner_id FK "nullable=false, refs USERS(id)"
        varchar name "nullable=false"
        text description "nullable=true"
        varchar cuisine "nullable=false"
        varchar address "nullable=false"
        varchar phone "nullable=true"
        varchar image_url "nullable=true"
        varchar operating_hours "nullable=true"
        boolean available "default=true"
        timestamp created_at "updatable=false"
        timestamp updated_at "nullable=true"
    }

    DISHES {
        bigint id PK
        bigint restaurant_id FK "nullable=false, refs RESTAURANTS(id)"
        varchar name "nullable=false"
        text description "nullable=true"
        numeric price "precision=10, scale=2, nullable=false"
        varchar image_url "nullable=true"
        varchar category "nullable=true"
        boolean available "default=true"
        integer preparation_time_minutes "nullable=true"
        timestamp created_at "updatable=false"
    }

    ORDERS {
        bigint id PK
        varchar order_number UK "nullable=false, unique"
        bigint customer_id FK "nullable=false, refs USERS(id)"
        bigint restaurant_id FK "nullable=false, refs RESTAURANTS(id)"
        bigint delivery_worker_id FK "nullable=true, refs USERS(id)"
        varchar status "nullable=false, enum"
        varchar payment_status "nullable=false, enum"
        varchar payment_method "nullable=false, enum"
        varchar delivery_address "nullable=false"
        varchar customer_phone "nullable=true"
        numeric subtotal "precision=10, scale=2, nullable=false"
        numeric delivery_fee "precision=10, scale=2, nullable=false"
        numeric tax "precision=10, scale=2, nullable=false"
        numeric discount "precision=10, scale=2, nullable=false"
        numeric total_amount "precision=10, scale=2, nullable=false"
        text failure_reason "nullable=true"
        timestamp created_at "updatable=false"
        timestamp updated_at "nullable=true"
    }

    ORDER_ITEMS {
        bigint id PK
        bigint order_id FK "nullable=false, refs ORDERS(id)"
        bigint dish_id FK "nullable=true, refs DISHES(id)"
        varchar dish_name "nullable=false (snapshot)"
        numeric unit_price "precision=10, scale=2, nullable=false (snapshot)"
        integer quantity "nullable=false"
        numeric subtotal "precision=10, scale=2, nullable=false"
    }
```

---

## 3. PlantUML Class Diagram Representation

For IDE plugins (IntelliJ PlantUML viewer, VS Code PlantUML):

```plantuml
@startuml Muncho_Data_Model
skinparam classAttributeIconSize 0
skinparam monochrome false
skinparam roundcorner 8
skinparam linetype ortho

enum Role {
    CUSTOMER
    RESTAURANT_OWNER
    DELIVERY_WORKER
}

enum OrderStatus {
    PLACED
    ACCEPTED
    REJECTED
    PREPARING
    READY_FOR_PICKUP
    OUT_FOR_DELIVERY
    DELIVERED
    FAILED
    CANCELLED
}

enum PaymentStatus {
    PENDING
    PAID
    FAILED
    REFUNDED
}

enum PaymentMethod {
    CARD
    CASH
    UPI
}

class User <<Entity>> {
    +Long id : PK
    +String email : UNIQUE
    +String password
    +String fullName
    +String phone
    +Role role
    +boolean available = true
    +LocalDateTime createdAt
    #onCreate() : void
}

class Restaurant <<Entity>> {
    +Long id : PK
    +String name
    +String description
    +String cuisine
    +String address
    +String phone
    +String imageUrl
    +String operatingHours
    +boolean available = true
    +User owner : FK
    +LocalDateTime createdAt
    +LocalDateTime updatedAt
    #onCreate() : void
    #onUpdate() : void
}

class Dish <<Entity>> {
    +Long id : PK
    +Restaurant restaurant : FK
    +String name
    +String description
    +BigDecimal price
    +String imageUrl
    +String category
    +boolean available = true
    +Integer preparationTimeMinutes
    +LocalDateTime createdAt
    #onCreate() : void
}

class Order <<Entity>> {
    +Long id : PK
    +String orderNumber : UNIQUE
    +User customer : FK
    +Restaurant restaurant : FK
    +User deliveryWorker : FK [0..1]
    +OrderStatus status = PLACED
    +PaymentStatus paymentStatus = PENDING
    +PaymentMethod paymentMethod
    +String deliveryAddress
    +String customerPhone
    +BigDecimal subtotal
    +BigDecimal deliveryFee
    +BigDecimal tax
    +BigDecimal discount
    +BigDecimal totalAmount
    +String failureReason
    +List<OrderItem> items
    +LocalDateTime createdAt
    +LocalDateTime updatedAt
    #onCreate() : void
    #onUpdate() : void
}

class OrderItem <<Entity>> {
    +Long id : PK
    +Order order : FK
    +Dish dish : FK [0..1]
    +String dishName
    +BigDecimal unitPrice
    +int quantity
    +BigDecimal subtotal
}

' Relationships
User "1" --> "0..*" Restaurant : "owns (owner_id)"
Restaurant "1" --> "0..*" Dish : "offers (restaurant_id)"

User "1" --> "0..*" Order : "places (customer_id)"
User "0..1" --> "0..*" Order : "delivers (delivery_worker_id)"
Restaurant "1" --> "0..*" Order : "fulfills (restaurant_id)"

Order "1" *-- "1..*" OrderItem : "contains [cascade=ALL, orphanRemoval=true]"
OrderItem "0..*" --> "0..1" Dish : "references (dish_id)"

User ..> Role
Order ..> OrderStatus
Order ..> PaymentStatus
Order ..> PaymentMethod

@enduml
```

---

## 4. Relationship Details & Multiplicity Matrix

| Relationship | Source Entity | Target Entity | Foreign Key Column | Cardinality | Cascade / Lifecycle Rules | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Owner Ownership** | `Restaurant` | `User` | `owner_id` (NOT NULL) | `Restaurant` N:1 `User` | Fetch: `LAZY` | A user with role `RESTAURANT_OWNER` can own multiple restaurants. |
| **Menu Offering** | `Dish` | `Restaurant` | `restaurant_id` (NOT NULL) | `Dish` N:1 `Restaurant` | Fetch: `LAZY` | Every dish belongs strictly to one restaurant. |
| **Customer Placement** | `Order` | `User` | `customer_id` (NOT NULL) | `Order` N:1 `User` | Fetch: `LAZY` | A customer (`CUSTOMER` role) places 0 or more orders. |
| **Order Fulfillment** | `Order` | `Restaurant` | `restaurant_id` (NOT NULL) | `Order` N:1 `Restaurant` | Fetch: `LAZY` | An order is prepared by exactly 1 restaurant. |
| **Delivery Assignment** | `Order` | `User` | `delivery_worker_id` (NULLABLE) | `Order` N:0..1 `User` | Fetch: `LAZY` | An order can be assigned to at most 1 delivery courier (`DELIVERY_WORKER` role). Unassigned on creation. |
| **Order Composition** | `Order` | `OrderItem` | `order_id` (NOT NULL) | `Order` 1:N `OrderItem` | `CascadeType.ALL`, `orphanRemoval=true` | Strict composition: lifecycle of `OrderItem` is bound to `Order`. Deleting an order deletes its line items. |
| **Historical Dish Link** | `OrderItem` | `Dish` | `dish_id` (NULLABLE) | `OrderItem` N:0..1 `Dish` | Fetch: `LAZY` | Optional reference to catalog dish. Retains `dishName` & `unitPrice` snapshots to preserve financial integrity if dishes are deleted or re-priced. |

---

## 5. Order Status Lifecycle (State Transition Diagram)

The relationships between `User` (Customer, Owner, Delivery Worker) and `Order` govern the order state transitions:

```mermaid
stateDiagram-v2
    [*] --> PLACED : Customer creates order

    PLACED --> ACCEPTED : Restaurant Owner accepts
    PLACED --> REJECTED : Restaurant Owner rejects (Triggers Refund if PAID)

    ACCEPTED --> PREPARING : Restaurant Owner starts kitchen prep
    PREPARING --> READY_FOR_PICKUP : Food cooked & packaged

    READY_FOR_PICKUP --> OUT_FOR_DELIVERY : Delivery Worker picks up
    ACCEPTED --> OUT_FOR_DELIVERY : Courier pickup
    PREPARING --> OUT_FOR_DELIVERY : Courier pickup

    OUT_FOR_DELIVERY --> DELIVERED : Courier delivers (CASH marked PAID)
    OUT_FOR_DELIVERY --> FAILED : Delivery failed (Reason required)

    REJECTED --> [*]
    DELIVERED --> [*]
    FAILED --> [*]
```
