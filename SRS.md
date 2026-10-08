# Software Requirements Specification (SRS)
## For
# MUNCHO - Smart Food Delivery Application

**Version 1.0 approved**

**Prepared by**
Abishek Ramaswami (24CSR009)  
Akash K N (24CSR013)  
Akilan S G (24CSR014)  
Anbuselvan S (24CSR022)  

**KONGU ENGINEERING COLLEGE**

**17 July, 2026**

---

## Revision History

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 17 July 2026 | 1.0 | Initial SRS for Muncho | Abishek Ramaswami |
| 20 July 2026 | 1.1 | Updated user stories and sprint data | Akash K N |
| 25 July 2026 | 1.2 | Added pain points and persona analysis | Akilan S G |
| 30 July 2026 | 1.3 | Final review and formatting | Anbuselvan S |

---

## Table of Contents

1. Introduction
   1.1 Purpose
   1.2 Document Conventions
   1.3 Intended Audience and Reading Suggestions
   1.4 Product Scope
   1.5 References
2. Overall Description
   2.1 Product Perspective
   2.2 Product Functions
   2.3 User Classes and Characteristics
   2.4 Operating Environment
   2.5 Design and Implementation Constraints
   2.6 User Documentation
   2.7 Assumptions and Dependencies
3. External Interface Requirements
   3.1 User Interfaces
   3.2 Hardware Interfaces
   3.3 Software Interfaces
   3.4 Communications Interfaces
4. System Features
   4.1 User Authentication and Role Management
   4.2 Restaurant Discovery and Menu Management
   4.3 Order Management
   4.4 Payment Processing
   4.5 Delivery Tracking and Management
   4.6 Notification and Feedback Management
   4.7 Administration and System Configuration
5. Other Nonfunctional Requirements
   5.1 Performance Requirements
   5.2 Safety Requirements
   5.3 Security Requirements
   5.4 Software Quality Attributes
   5.5 Business Rules
6. Other Requirements
   6.1 Database Requirements
   6.2 Scalability Requirements
   6.3 Localization Requirements
   6.4 Legal and Compliance Requirements
   6.5 Backup and Recovery Requirements
   6.6 Future Enhancement Requirements
Appendix A: Glossary
Appendix B: Analysis Models
Appendix C: To Be Determined List
Appendix D: User Personas
Appendix E: Sprint Documentation
Appendix F: User Stories
Appendix G: Pain Points and Solutions
Appendix H: Sprint-wise Task Breakdown
Appendix I: Technical Architecture
Appendix J: Testing Strategy
Appendix K: Deployment Strategy
Appendix L: Project Timeline
Appendix M: Risk Assessment
Appendix N: Success Metrics
Appendix O: Future Roadmap

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document defines the functional and non-functional requirements of **Muncho - Smart Food Delivery Application** (Version 1.0).

The purpose of this document is to provide a complete description of the software system, its features, expected behaviour, constraints, and user interactions. It serves as a reference document between stakeholders, developers, testers, and project team members throughout the software development process.

Muncho is a web and mobile-based food delivery platform designed to connect users with local restaurants, cloud kitchens, and food vendors. The system covers restaurant discovery, menu browsing, order placement, payment processing, delivery tracking, and user feedback.

The scope of this SRS covers the complete Muncho system, including:

- **User Portal** for restaurant discovery, ordering, and tracking.
- **Restaurant Partner Portal** for managing menus, orders, and availability.
- **Delivery Partner Portal** for accepting and managing deliveries.
- **Administrator Portal** for managing users, restaurants, delivery partners, and reports.

The system aims to provide a seamless, affordable, and reliable food delivery experience, addressing key pain points identified through user research, including high delivery charges, hidden fees, long delivery times, and lack of transparent pricing.

### 1.2 Document Conventions

This SRS document follows the standard structure and guidelines recommended for Software Requirements Specification documents.

The following conventions are used throughout this document:

- Section numbers are organized hierarchically to provide easy navigation.
- **Bold text** is used to highlight important terms, system modules, and user roles.
- Functional requirements are identified using the format **FR-XXX**. Example: **FR-001 - User Registration**
- Non-functional requirements are identified using the format **NFR-XXX**. Example: **NFR-001 - System Performance**
- The terms used in this document have the following meanings:
  - **Shall**: Indicates a mandatory system requirement.
  - **Should**: Indicates a recommended requirement.
  - **May**: Indicates an optional feature.
- Requirements are assigned priorities based on their importance:
  - **High Priority**: Essential features required for system operation.
  - **Medium Priority**: Important features that improve usability.
  - **Low Priority**: Additional features that can be implemented in future versions.

### 1.3 Intended Audience and Reading Suggestions

This document is intended for all individuals involved in the planning, development, testing, and evaluation of the Muncho system.

The intended audience includes:

#### Project Team
Developers can use this document to understand system functionality, user requirements, database requirements, and implementation needs.

#### Project Managers
Project managers can refer to this document for understanding project scope, planning development activities, and tracking project progress.

#### UI/UX Designers
Designers can use this document to create user interfaces and workflows that satisfy customer, restaurant partner, and delivery partner requirements.

#### Testers
Testing teams can use this document to prepare test cases and verify whether the developed system meets the specified requirements.

#### Faculty Evaluators and Stakeholders
They can review this document to understand the objectives, features, and expected outcomes of the proposed system.

#### Future Maintainers
Future developers can refer to this document for system modifications, enhancements, and maintenance activities.

The recommended reading sequence is:

1. **Introduction** - Understand the purpose and scope of the system.
2. **Overall Description** - Understand system users, assumptions, and constraints.
3. **System Features** - Understand the major functionalities.
4. **External Interface Requirements** - Understand user interface and technical interactions.
5. **Functional and Non-Functional Requirements** - Understand detailed system behavior and quality requirements.

### 1.4 Product Scope

Muncho is a web and mobile-based Smart Food Delivery Application developed to modernize the process of ordering food online from local restaurants and food vendors.

Currently, customers face several challenges when ordering food online:
- High delivery charges and hidden fees.
- Long and unpredictable delivery times.
- Lack of transparency in pricing.
- Difficulty in discovering new restaurants and cuisines.
- Poor user experience with existing platforms.

Muncho addresses these challenges by providing a centralized platform for restaurant discovery, menu browsing, order placement, real-time tracking, and feedback.

The system enables **customers** to:
- Register and log into the platform.
- Browse restaurants and menus.
- Search for food items and restaurants.
- View detailed menu items with prices and descriptions.
- Add items to cart and place orders.
- Make secure payments.
- Track order status in real-time.
- Receive notifications regarding order updates.
- Provide ratings and reviews.
- View order history.

The system enables **restaurant partners** to:
- Register and manage their restaurant profile.
- Add, update, and remove menu items.
- Manage item availability and pricing.
- View and process incoming orders.
- Update order status.
- View sales and order analytics.

The system enables **delivery partners** to:
- Register and manage their delivery profile.
- View available delivery requests.
- Accept and manage deliveries.
- Update delivery status.
- View earnings and delivery history.

The system enables **administrators** to:
- Manage customer, restaurant, and delivery partner accounts.
- Configure platform settings.
- Monitor orders and transactions.
- Generate reports and analytics.
- Manage disputes and feedback.

The major objectives of Muncho are:
- To provide a seamless and affordable food delivery experience.
- To reduce delivery charges and eliminate hidden fees.
- To provide accurate delivery time estimates.
- To improve transparency in pricing and order tracking.
- To support local restaurants and food vendors.
- To provide a user-friendly interface for all stakeholders.

The system supports multiple restaurants, cuisines, and locations and can be expanded in the future to support additional features and regions.

### 1.5 References

The following documents and resources were referred during the preparation of this Software Requirements Specification:

| REFERENCE | DETAILS |
|-----------|---------|
| IEEE 29148-2018 | Systems and Software Engineering - Life Cycle Processes - Requirements Engineering. IEEE Computer Society, 2018. |
| IEEE 830-1998 | IEEE Recommended Practice for Software Requirements Specifications. IEEE Computer Society. |
| Sommerville, Ian | Software Engineering, 10th Edition, Pearson Education, 2015. |
| Pressman, Roger S. & Maxim, Bruce R. | Software Engineering: A Practitioner's Approach, 9th Edition, McGraw Hill, 2019. |
| Agile Manifesto | Manifesto for Agile Software Development, 2001. |
| User Research Documentation | Interviews and observations conducted to understand existing food delivery challenges and user preferences. |
| UI/UX Design Documentation | User flows, wireframes, prototypes, and usability testing documents prepared for Muncho. |
| Sprint Documents | Sprint 1, Sprint 2, Sprint 3, Sprint 4, and Sprint 5 documents with user stories and task breakdowns. |
---

## 2. Overall Description

### 2.1 Product Perspective

Muncho is a new, self-contained web and mobile-based application developed to improve the food ordering and delivery process. The system is designed to replace existing fragmented approaches where customers face high charges, hidden fees, and unreliable delivery times.

The proposed system acts as a digital platform connecting four major stakeholders:

- **Customers** who order food online.
- **Restaurant Partners** who prepare and provide food.
- **Delivery Partners** who deliver food to customers.
- **Administrators** who manage system configuration and operations.

Muncho is not intended to replace existing payment gateways or restaurant POS systems. Instead, it functions as a comprehensive food delivery management layer that improves customer experience, restaurant operations, and delivery efficiency.

The overall system consists of the following major components:

[INSERT SYSTEM ARCHITECTURE DIAGRAM HERE]

- **Customer Portal**: Allows customers to browse restaurants, order food, and track deliveries.
- **Restaurant Partner Portal**: Enables restaurants to manage menus and orders.
- **Delivery Partner Portal**: Enables delivery partners to manage deliveries.
- **Admin Portal**: Provides administrative control over system settings.
- **Database**: Stores user data, restaurant data, order data, and delivery data.
- **Application Server**: Processes requests from portals and interacts with the database.
- **Notification Services**: Sends alerts and updates to users.

The system provides interfaces between users and the application through a web-based interface and mobile application. The backend manages user information, restaurant data, menu items, orders, delivery tracking, and transaction records.

### 2.2 Product Functions

The Muncho system provides the following major functions:

#### Customer Functions
- User registration and authentication.
- Browse restaurants and menus.
- Search for food items and restaurants.
- View detailed menu items with prices and descriptions.
- Add items to cart and manage cart.
- Apply offers and discounts.
- Place orders with delivery address.
- Make secure payments.
- Track order status in real-time.
- Receive order notifications.
- View order history.
- Provide ratings and reviews.
- Manage user profile and addresses.

#### Restaurant Partner Functions
- Secure restaurant login.
- Manage restaurant profile.
- Add, update, and remove menu items.
- Manage item availability and pricing.
- View incoming orders.
- Accept or reject orders.
- Update order preparation status.
- View sales and order analytics.
- Manage restaurant timings.

#### Delivery Partner Functions
- Secure delivery partner login.
- Manage delivery profile.
- View available delivery requests.
- Accept delivery requests.
- Update delivery status.
- View delivery history and earnings.
- Manage availability status.

#### Administrator Functions
- Manage customer, restaurant, and delivery partner accounts.
- Add, update, or remove restaurants.
- Configure platform settings and commissions.
- Monitor orders and transactions.
- Manage disputes and feedback.
- Generate reports and analytics.
- Manage offers and promotions.

#### System-Level Functions
- Maintain user records securely.
- Manage restaurant and menu data.
- Process orders and payments.
- Generate unique order IDs.
- Maintain real-time order and delivery status.
- Provide role-based access control.
- Store transaction history for future reference.
- Send notifications via SMS, email, and push notifications.

### 2.3 User Classes and Characteristics

The Muncho system has four primary user classes.

#### 1. Customer (Primary User)

**Description:**
Customers are the main users who access the system to order food online.

**Characteristics:**
- May have different levels of technical knowledge.
- Includes students, working professionals, and families.
- Requires a simple and easy-to-understand interface.
- May access the system through smartphones, tablets, or computers.
- Price-sensitive and looks for offers and discounts.
- Values quick delivery and reliable service.

**Functions Used:**
- Account creation.
- Restaurant discovery.
- Menu browsing.
- Order placement.
- Payment processing.
- Order tracking.
- Feedback submission.

**Importance Level:**
High - The system is primarily designed to improve customer experience.

#### 2. Restaurant Partner (Operational User)

**Description:**
Restaurant partners use the system to manage their menu and process orders.

**Characteristics:**
- Moderate computer knowledge.
- Responsible for preparing and packaging food.
- Requires fast access to order information.
- Needs to manage menu availability and pricing.

**Functions Used:**
- Menu management.
- Order processing.
- Order status updates.
- Sales analytics.

**Importance Level:**
High - Restaurant interaction directly affects order fulfillment.

#### 3. Delivery Partner (Operational User)

**Description:**
Delivery partners use the system to manage deliveries.

**Characteristics:**
- Moderate smartphone knowledge.
- Responsible for picking up and delivering orders.
- Requires real-time access to delivery requests.
- Needs navigation and delivery tracking.

**Functions Used:**
- Delivery request management.
- Delivery status updates.
- Earnings tracking.

**Importance Level:**
High - Delivery partner interaction directly affects delivery efficiency.

#### 4. Administrator (System Manager)

**Description:**
Administrators manage the overall configuration and maintenance of the system.

**Characteristics:**
- Advanced system knowledge.
- Responsible for maintaining data accuracy and user permissions.
- Manages platform operations and disputes.

**Functions Used:**
- User management.
- Restaurant management.
- Delivery partner management.
- Order monitoring.
- Reports and analytics.

**Importance Level:**
Medium - Required for system maintenance and administration.

### 2.4 Operating Environment

The Muncho system will operate as a web-based application and mobile application accessible through modern browsers and mobile devices.

#### Hardware Requirements

**Client Side:**
- Desktop computers, laptops, tablets, or smartphones.
- Minimum 2GB RAM recommended.
- Internet connectivity.
- GPS for delivery tracking (mobile).

**Server Side:**
- Application server capable of hosting backend services.
- Database server for storing application data.
- Cloud storage for images and media.

#### Software Environment

**Frontend:**
- React.js
- HTML5
- CSS3
- JavaScript
- Responsive UI framework (Tailwind CSS/Material UI)
- React Native (for mobile app)

**Backend:**
- Node.js
- Express.js

**Database:**
- MongoDB

**Development Tools:**
- Visual Studio Code
- Git/GitHub
- Postman for API testing
- MongoDB Compass

**Supported Browsers:**
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

**Mobile Platforms:**
- Android
- iOS

### 2.5 Design and Implementation Constraints

The following constraints apply during development:

#### Technology Constraints
- The system shall be developed as a web and mobile application.
- Frontend and backend technologies must support scalability and maintainability.
- Database design must support multiple restaurants, menus, and orders.
- Payment gateway integration must comply with security standards.

#### Security Constraints
- User authentication must be implemented.
- Access permissions must be controlled based on user roles.
- Sensitive user information must be stored securely.
- Payment information must be encrypted.

#### Usability Constraints
- The interface should be simple enough for users with limited technical knowledge.
- The system should support accessibility considerations.
- The application should be responsive across different devices.

#### Development Constraints
- Implementation will follow Agile development methodology.
- The project will use available open-source technologies.
- The system will integrate with third-party payment gateways and maps.

#### Operational Constraints
- The system depends on stable internet connectivity.
- Delivery availability depends on delivery partner availability and location.
- Restaurant availability depends on restaurant timings and capacity.

### 2.6 User Documentation

The following documentation will be provided along with the Muncho system:

#### User Manual
A guide explaining:
- User registration.
- Restaurant discovery.
- Order placement.
- Payment process.
- Order tracking.
- Feedback submission.

#### Restaurant Partner Manual
A guide explaining:
- Restaurant login.
- Menu management.
- Order processing.
- Order status updates.
- Sales analytics.

#### Delivery Partner Manual
A guide explaining:
- Delivery partner login.
- Accepting delivery requests.
- Updating delivery status.
- Earnings tracking.

#### Administrator Guide
Documentation covering:
- User management.
- Restaurant management.
- Delivery partner management.
- Order monitoring.
- Report generation.

#### System Documentation
Includes:
- Software Requirements Specification (SRS).
- Database design.
- System architecture.
- API documentation.
- Testing documentation.

### 2.7 Assumptions and Dependencies

#### Assumptions
The following assumptions are considered during system development:
- Customers have access to smartphones or computers for online ordering.
- Restaurant partners have access to the restaurant dashboard.
- Delivery partners have access to smartphones with GPS.
- Customers will provide accurate delivery addresses.
- Internet connectivity will be available during system usage.
- Payment gateways will be available for processing payments.

#### Dependencies
The Muncho system depends on:
- Internet connectivity for accessing the web and mobile application.
- Web browser compatibility.
- Database availability for storing system information.
- Notification services for sending order updates.
- Hosting environment for deploying the application.
- Payment gateway services for processing payments.
- Map services for delivery tracking and navigation.

Future enhancements may depend on integration with:
- Restaurant POS systems.
- Third-party delivery services.
- Loyalty and rewards programs.
---

## 3. External Interface Requirements

### 3.1 User Interfaces

The Muncho system provides a web-based and mobile user interface that enables interaction between customers, restaurant partners, delivery partners, and administrators. The interface is designed to be simple, responsive, and accessible for users with different levels of technical expertise.

The user interface follows a clean, modern food delivery application design approach, focusing on clarity, accessibility, and ease of navigation.

The major user interface components are:

#### Customer Interface

The customer portal provides the following screens:

**1. Login and Registration Screen**
- Allows customers to create an account and securely access the system.
- Accepts user details such as name, mobile number, email, and password.
- Displays validation messages for incorrect inputs.

**2. Customer Dashboard**
Displays:
- Available restaurants.
- Search bar for food and restaurants.
- Categories and cuisines.
- Ongoing orders.
- Offers and promotions.
- Notifications and alerts.

**3. Restaurant Listing Screen**
Allows users to:
- Browse restaurants by category.
- View restaurant ratings and delivery time.
- Filter by price, rating, and delivery time.
- Sort by relevance, rating, and delivery time.

**4. Restaurant Menu Screen**
Displays:
- Restaurant details.
- Menu categories.
- Item details with prices and descriptions.
- Add to cart option.

**5. Cart Screen**
Allows users to:
- View added items.
- Update quantities.
- Remove items.
- View total price with breakdown.
- Apply offers and coupons.

**6. Checkout Screen**
Allows users to:
- Select delivery address.
- Choose payment method.
- View order summary.
- Confirm order.

**7. Order Tracking Screen**
Displays:
- Order status (confirmed, preparing, out for delivery, delivered).
- Estimated delivery time.
- Delivery partner details.
- Real-time location tracking.

**8. Order History Screen**
Displays:
- Past orders.
- Order details.
- Reorder option.
- Rating and review option.

**9. Feedback Screen**
Allows users to:
- Rate food and delivery experience.
- Submit suggestions or complaints.

**10. Profile Screen**
Allows users to:
- Manage personal information.
- Manage delivery addresses.
- Manage payment methods.
- View notifications.

#### Restaurant Partner Interface

The restaurant partner dashboard provides:
- Secure restaurant login.
- Restaurant profile management.
- Menu management (add, update, remove items).
- Order management (view, accept, reject, update status).
- Sales and order analytics.
- Restaurant timings management.

#### Delivery Partner Interface

The delivery partner dashboard provides:
- Secure delivery partner login.
- Delivery profile management.
- Available delivery requests.
- Delivery acceptance and management.
- Delivery status updates.
- Earnings and delivery history.
- Availability status management.

#### Administrator Interface

The administrator interface provides:
- User management (customers, restaurants, delivery partners).
- Restaurant management.
- Order monitoring.
- Dispute management.
- Reports and analytics.
- Platform settings configuration.

#### General UI Standards

The following interface standards will be followed:
- Responsive design supporting desktop, tablet, and mobile devices.
- Consistent navigation across all screens.
- Clear button labels and icons.
- Form validation before data submission.
- Meaningful error and success messages.

Example:

**Success Message:**
"Order placed successfully. Your order ID is MUN12345."

**Error Message:**
"Selected item is unavailable. Please choose another item."

### 3.2 Hardware Interfaces

The Muncho system operates on standard computing devices and does not require specialized hardware.

#### Client-Side Hardware

The system supports:

**Desktop/Laptop**
- Used mainly by restaurant partners and administrators.
- Requires:
  - Keyboard
  - Mouse
  - Display monitor
  - Internet connection

**Mobile Devices**
- Used mainly by customers and delivery partners.
- Supports:
  - Smartphones
  - Tablets
  - Touch interaction
  - GPS for delivery tracking

#### Server Hardware

The application requires:
- Application hosting server.
- Database server.
- Storage system for maintaining user, restaurant, and order data.
- Cloud storage for images and media.

#### Hardware Communication

The system communicates with hardware through:
- Web browsers.
- Mobile applications.
- Internet connectivity.
- Standard HTTP/HTTPS communication protocols.
- GPS for delivery tracking.

No additional hardware devices such as biometric scanners or printers are required for the initial version.

Future versions may support:
- POS integration for restaurants.
- Self-service kiosks.
- Smart display screens for order tracking.

### 3.3 Software Interfaces

The Muncho system interacts with multiple software components required for application development, operation, and maintenance.

#### Frontend Interface

**Technology:**
- React.js
- React Native (for mobile app)

**Purpose:**
- Provides interactive user interfaces for customers, restaurant partners, delivery partners, and administrators.
- Communicates with backend services through REST APIs.

**Data Exchange:**

Frontend sends:
- Login credentials.
- Order details.
- Restaurant selections.
- Feedback information.

Frontend receives:
- User profile information.
- Restaurant and menu details.
- Order status.
- Notifications.

#### Backend Interface

**Technology:**
- Node.js
- Express.js

**Purpose:**
- Handles business logic.
- Processes user requests.
- Manages orders and delivery operations.

The backend provides APIs for:
- Authentication.
- User management.
- Restaurant management.
- Menu management.
- Order processing.
- Delivery tracking.
- Payment processing.

#### Database Interface

**Technology:**
- MongoDB

**Purpose:**
Stores the following data:

**User Data**
- User profile information.
- Login credentials.
- Role details.
- Delivery addresses.

**Restaurant Data**
- Restaurant profile.
- Menu items.
- Pricing.
- Availability.

**Order Data**
- Order details.
- Order status.
- Payment status.

**Delivery Data**
- Delivery partner details.
- Delivery status.
- Delivery location.

**Feedback Data**
- Ratings.
- Reviews.
- Suggestions.

#### Development and Testing Tools

| Component | Technology |
|-----------|------------|
| Code Editor | Visual Studio Code |
| Version Control | Git/GitHub |
| API Testing | Postman |
| Database Management | MongoDB Compass |
| Mobile Testing | Android Studio / Xcode |

#### External Services (Future Integration)

The system may integrate with:
- Payment gateways (Razorpay, Stripe).
- SMS gateway for order notifications.
- Email notification services.
- Map services for delivery tracking.
- Social media for login and sharing.

### 3.4 Communications Interfaces

The Muncho system requires network communication between users, application servers, and database services.

#### Web Communication

The system uses:

**Protocol:**
- HTTP/HTTPS

**Purpose:**
- Communication between browser clients and application servers.
- HTTPS will be used to ensure secure transmission of user data.

#### API Communication

The frontend and backend communicate through RESTful APIs.

Example:

**Request:**
```
POST /api/order/place
```

Data sent:
```json
{
  "userId": "101",
  "restaurantId": "201",
  "items": [
    {"itemId": "301", "quantity": 2},
    {"itemId": "302", "quantity": 1}
  ],
  "deliveryAddress": "123 Main St",
  "paymentMethod": "card"
}
```

**Response:**
```json
{
  "status": "success",
  "orderId": "MUN12345",
  "estimatedDelivery": "30 mins"
}
```

#### Notification Communication

The system may use:
- SMS notifications.
- Email notifications.
- Push notifications.
- In-app notifications.

Notifications include:
- Order confirmation.
- Order status updates.
- Delivery updates.
- Promotional offers.

#### Security Requirements

Communication security includes:
- HTTPS encryption.
- Secure authentication tokens.
- Protected API endpoints.
- Role-based access control.
- Payment data encryption.

#### Network Requirements

The system requires:
- Stable internet connectivity.
- Standard web communication support.
- Reliable data transfer between client and server.
- GPS connectivity for delivery tracking.
---

## 4. System Features

### 4.1 User Authentication and Role Management

#### 4.1.1 Description and Priority

This feature manages user registration, login, authentication, and access control for different user roles in the Muncho system.

The system supports four types of users:
- Customer
- Restaurant Partner
- Delivery Partner
- Administrator

Each user will have access only to the features permitted for their role.

**Priority:** High

| PRIORITY FACTOR | RATING |
|-----------------|--------|
| Benefit | 9 |
| Penalty if unavailable | 9 |
| Implementation Cost | 3 |
| Technical Risk | 2 |

#### 4.1.2 Stimulus/Response Sequences

**CUSTOMER REGISTRATION:**

| USER ACTION | SYSTEM RESPONSE |
|-------------|-----------------|
| User selects registration option | System displays registration form |
| User enters personal details | System validates entered information |
| User submits registration | System creates account |
| Registration successful | System displays confirmation message |

**USER LOGIN:**

| USER ACTION | SYSTEM RESPONSE |
|-------------|-----------------|
| User enters credentials | System verifies credentials |
| Credentials are valid | User is redirected to respective dashboard |
| Credentials are invalid | System displays error message |

#### 4.1.3 Functional Requirements

**REQ-AUTH-001:** The system shall allow customers, restaurant partners, delivery partners, and administrators to create and access accounts based on their assigned roles.

**REQ-AUTH-002:** The system shall validate user login credentials before granting access.

**REQ-AUTH-003:** The system shall provide role-based access control to restrict unauthorized features.

**REQ-AUTH-004:** The system shall display appropriate error messages for invalid login attempts.

**REQ-AUTH-005:** The system shall securely store user authentication information.

**REQ-AUTH-006:** The system shall allow users to update their profile information.

**REQ-AUTH-007:** The system shall support password recovery via email or mobile number.

**REQ-AUTH-008:** The system shall support social media login for customers.

### 4.2 Restaurant Discovery and Menu Management

#### 4.2.1 Description and Priority

This feature manages restaurant discovery, menu browsing, and search functionality for customers.

**Priority:** High

| PRIORITY FACTOR | RATING |
|-----------------|--------|
| Benefit | 9 |
| Penalty if unavailable | 9 |
| Implementation Cost | 6 |
| Technical Risk | 4 |

#### 4.2.2 Stimulus/Response Sequences

**RESTAURANT DISCOVERY:**

| USER ACTION | SYSTEM RESPONSE |
|-------------|-----------------|
| Customer opens app | System displays nearby restaurants |
| Customer searches for food | System displays matching restaurants and items |
| Customer selects restaurant | System displays restaurant menu |
| Customer selects category | System filters menu items |

**MENU MANAGEMENT (Restaurant Partner):**

| USER ACTION | SYSTEM RESPONSE |
|-------------|-----------------|
| Restaurant partner logs in | System displays dashboard |
| Partner adds new item | System updates menu |
| Partner updates item price | System updates pricing |
| Partner marks item unavailable | System updates availability |

#### 4.2.3 Functional Requirements

**REQ-REST-001:** The system shall display a list of available restaurants based on user location.

**REQ-REST-002:** The system shall allow customers to search for restaurants and food items.

**REQ-REST-003:** The system shall display restaurant details including rating, delivery time, and cost for two.

**REQ-REST-004:** The system shall display menu items with prices, descriptions, and images.

**REQ-REST-005:** The system shall allow customers to filter restaurants by cuisine, rating, and delivery time.

**REQ-REST-006:** The system shall allow restaurant partners to add, update, and remove menu items.

**REQ-REST-007:** The system shall allow restaurant partners to manage item availability and pricing.

**REQ-REST-008:** The system shall display restaurant timings and availability status.

### 4.3 Order Management

#### 4.3.1 Description and Priority

This feature manages the complete order lifecycle from cart to delivery.

**Priority:** High

| PRIORITY FACTOR | RATING |
|-----------------|--------|
| Benefit | 10 |
| Penalty if unavailable | 10 |
| Implementation Cost | 8 |
| Technical Risk | 5 |

#### 4.3.2 Stimulus/Response Sequences

**ORDER PLACEMENT:**

| USER ACTION | SYSTEM RESPONSE |
|-------------|-----------------|
| Customer adds items to cart | System updates cart |
| Customer proceeds to checkout | System displays order summary |
| Customer selects address and payment | System validates details |
| Customer confirms order | System creates order |
| Order placed | System generates order ID and confirmation |

**ORDER PROCESSING (Restaurant Partner):**

| USER ACTION | SYSTEM RESPONSE |
|-------------|-----------------|
| Restaurant receives order | System displays new order |
| Restaurant accepts order | System updates order status |
| Restaurant prepares order | System updates status to "Preparing" |
| Restaurant marks order ready | System updates status to "Ready for Pickup" |

**ORDER DELIVERY (Delivery Partner):**

| USER ACTION | SYSTEM RESPONSE |
|-------------|-----------------|
| Delivery partner accepts request | System assigns delivery |
| Delivery partner picks up order | System updates status to "Out for Delivery" |
| Delivery partner delivers order | System updates status to "Delivered" |

#### 4.3.3 Functional Requirements

**REQ-ORD-001:** The system shall allow customers to add items to cart.

**REQ-ORD-002:** The system shall allow customers to update cart quantities and remove items.

**REQ-ORD-003:** The system shall display order summary with price breakdown.

**REQ-ORD-004:** The system shall allow customers to apply offers and coupons.

**REQ-ORD-005:** The system shall allow customers to select delivery address and payment method.

**REQ-ORD-006:** The system shall generate a unique order ID after successful order placement.

**REQ-ORD-007:** The system shall allow restaurant partners to accept or reject orders.

**REQ-ORD-008:** The system shall allow restaurant partners to update order preparation status.

**REQ-ORD-009:** The system shall allow delivery partners to accept delivery requests.

**REQ-ORD-010:** The system shall allow delivery partners to update delivery status.

**REQ-ORD-011:** The system shall allow customers to view order history.

**REQ-ORD-012:** The system shall allow customers to reorder from past orders.

### 4.4 Payment Processing

#### 4.4.1 Description and Priority

This feature manages payment processing for orders.

**Priority:** High

| PRIORITY FACTOR | RATING |
|-----------------|--------|
| Benefit | 9 |
| Penalty if unavailable | 9 |
| Implementation Cost | 7 |
| Technical Risk | 6 |

#### 4.4.2 Stimulus/Response Sequences

**PAYMENT PROCESSING:**

| USER ACTION | SYSTEM RESPONSE |
|-------------|-----------------|
| Customer selects payment method | System displays payment options |
| Customer enters payment details | System validates payment |
| Payment successful | System confirms order |
| Payment failed | System displays error message |

#### 4.4.3 Functional Requirements

**REQ-PAY-001:** The system shall support multiple payment methods (credit card, debit card, UPI, net banking, cash on delivery).

**REQ-PAY-002:** The system shall securely process payments through payment gateways.

**REQ-PAY-003:** The system shall display payment confirmation after successful transaction.

**REQ-PAY-004:** The system shall handle payment failures and display appropriate error messages.

**REQ-PAY-005:** The system shall maintain payment transaction history.

**REQ-PAY-006:** The system shall support refund processing for cancelled orders.

### 4.5 Delivery Tracking and Management

#### 4.5.1 Description and Priority

This feature manages real-time delivery tracking and delivery partner management.

**Priority:** High

| PRIORITY FACTOR | RATING |
|-----------------|--------|
| Benefit | 8 |
| Penalty if unavailable | 8 |
| Implementation Cost | 7 |
| Technical Risk | 5 |

#### 4.5.2 Stimulus/Response Sequences

**DELIVERY TRACKING:**

| USER ACTION | SYSTEM RESPONSE |
|-------------|-----------------|
| Customer views order | System displays real-time status |
| Delivery partner updates location | System updates tracking |
| Order delivered | System notifies customer |

#### 4.5.3 Functional Requirements

**REQ-DEL-001:** The system shall provide real-time order tracking for customers.

**REQ-DEL-002:** The system shall display estimated delivery time.

**REQ-DEL-003:** The system shall allow delivery partners to view available delivery requests.

**REQ-DEL-004:** The system shall allow delivery partners to accept or reject delivery requests.

**REQ-DEL-005:** The system shall allow delivery partners to update delivery status.

**REQ-DEL-006:** The system shall display delivery partner details to customers.

**REQ-DEL-007:** The system shall provide navigation support for delivery partners.

**REQ-DEL-008:** The system shall track delivery partner earnings.

### 4.6 Notification and Feedback Management

#### 4.6.1 Description and Priority

This feature provides communication between the system and users through notifications and feedback collection.

**Priority:** Medium

| PRIORITY FACTOR | RATING |
|-----------------|--------|
| Benefit | 7 |
| Penalty if unavailable | 6 |
| Implementation Cost | 4 |
| Technical Risk | 3 |

#### 4.6.2 Stimulus/Response Sequences

**NOTIFICATION AND FEEDBACK:**

| USER ACTION | SYSTEM RESPONSE |
|-------------|-----------------|
| Order confirmed | System sends confirmation notification |
| Order status changes | System sends status update notification |
| Order delivered | System requests feedback |
| Customer submits feedback | System stores feedback |

#### 4.6.3 Functional Requirements

**REQ-NOTIFY-001:** The system shall send order confirmation notifications.

**REQ-NOTIFY-002:** The system shall send order status update notifications.

**REQ-NOTIFY-003:** The system shall send delivery update notifications.

**REQ-NOTIFY-004:** The system shall allow customers to provide ratings and reviews.

**REQ-NOTIFY-005:** The system shall store feedback records for analysis.

**REQ-NOTIFY-006:** The system shall send promotional notifications and offers.

### 4.7 Administration and System Configuration

#### 4.7.1 Description and Priority

This feature allows administrators to manage system settings, users, restaurants, delivery partners, and reports.

**Priority:** Medium

| PRIORITY FACTOR | RATING |
|-----------------|--------|
| Benefit | 7 |
| Penalty if unavailable | 7 |
| Implementation Cost | 5 |
| Technical Risk | 3 |

#### 4.7.2 Stimulus/Response Sequences

**ADMINISTRATION:**

| USER ACTION | SYSTEM RESPONSE |
|-------------|-----------------|
| Admin logs in | System displays admin dashboard |
| Admin manages users | System updates user database |
| Admin manages restaurants | System updates restaurant data |
| Admin generates report | System displays report |

#### 4.7.3 Functional Requirements

**REQ-ADMIN-001:** The system shall allow administrators to manage user accounts.

**REQ-ADMIN-002:** The system shall allow administrators to manage restaurant accounts.

**REQ-ADMIN-003:** The system shall allow administrators to manage delivery partner accounts.

**REQ-ADMIN-004:** The system shall allow administrators to configure platform settings.

**REQ-ADMIN-005:** The system shall generate reports on orders and transactions.

**REQ-ADMIN-006:** The system shall allow administrators to manage disputes and feedback.

**REQ-ADMIN-007:** The system shall allow administrators to manage offers and promotions.
---

## 5. Other Nonfunctional Requirements

### 5.1 Performance Requirements

The Muncho system shall provide efficient response times and support smooth operation during normal and peak usage conditions.

The performance requirements are:

#### RESPONSE TIME:

**NFR-PER-001:** The system shall respond to user actions such as login, restaurant search, and order placement within 3 seconds under normal operating conditions.

**NFR-PER-002:** The system shall update order status information within 5 seconds after any order-related activity.

**NFR-PER-003:** The system shall load restaurant menus within 2 seconds.

#### CONCURRENT USERS:

**NFR-PER-004:** The system shall support multiple users accessing the application simultaneously without significant performance degradation.

**NFR-PER-005:** The system shall support concurrent access from:
- Customers placing orders.
- Restaurant partners managing orders.
- Delivery partners managing deliveries.
- Administrators managing configurations.

#### ORDER PROCESSING:

**NFR-PER-006:** The system shall prevent duplicate order placements when multiple users attempt to order simultaneously.

**NFR-PER-007:** The system shall generate order IDs automatically within 2 seconds after successful order confirmation.

#### DATA PROCESSING:

**NFR-PER-008:** The system shall retrieve order history and delivery information efficiently without noticeable delays.

**NFR-PER-009:** The system shall handle peak load during lunch and dinner hours without performance degradation.

#### Rationale:
Fast response times improve customer satisfaction and reduce confusion during order placement.

### 5.2 Safety Requirements

The Muncho system handles customer, restaurant, and delivery partner information; therefore, appropriate safeguards must be implemented to prevent data loss, incorrect order processing, and service disruption.

#### DATA PROTECTION

**NFR-SAF-001:** The system shall prevent accidental deletion of important customer and order records without proper authorization.

**NFR-SAF-002:** The system shall maintain backup copies of important application data.

#### ORDER ACCURACY

**NFR-SAF-003:** The system shall ensure that order IDs are generated uniquely and cannot be duplicated.

**NFR-SAF-004:** The system shall prevent unauthorized users from modifying order status.

#### SYSTEM AVAILABILITY

**NFR-SAF-005:** The system shall handle unexpected failures without corrupting order and delivery information.

**NFR-SAF-006:** The system shall provide appropriate error messages instead of exposing system failures to users.

#### USER SAFETY

**NFR-SAF-007:** The system shall provide clear confirmation messages before completing important actions such as order cancellation.

**NFR-SAF-008:** The system shall ensure delivery partner safety by not sharing personal information with customers.

### 5.3 Security Requirements

Security is a critical requirement because the system stores customer information, payment details, and order-related records.

#### AUTHENTICATION

**NFR-SEC-001:** The system shall require users to authenticate before accessing protected features.

**NFR-SEC-002:** The system shall provide separate access permissions for:
- Customers
- Restaurant Partners
- Delivery Partners
- Administrators

**NFR-SEC-003:** Customers shall only be allowed to view and manage their own orders.

**NFR-SEC-004:** Restaurant partners shall only access order and menu information required for their operations.

**NFR-SEC-005:** Delivery partners shall only access delivery information required for their operations.

**NFR-SEC-006:** Only administrators shall be allowed to modify system configurations.

#### DATA SECURITY

**NFR-SEC-007:** The system shall encrypt sensitive user information during data transmission.

**NFR-SEC-008:** Passwords shall not be stored in plain text format.

**NFR-SEC-009:** The system shall protect APIs from unauthorized access.

**NFR-SEC-010:** Payment information shall be encrypted and processed through secure gateways.

#### PRIVACY

**NFR-SEC-011:** The system shall collect only necessary user information required for providing services.

**NFR-SEC-012:** User data shall not be accessed or shared without proper authorization.

**NFR-SEC-013:** Delivery partners shall not have access to customer personal information beyond delivery requirements.

### 5.4 Software Quality Attributes

The Muncho system shall maintain high standards of usability, reliability, maintainability, and scalability.

#### USABILITY

**NFR-QUAL-001:** The system shall provide a simple and intuitive interface suitable for users with different technical abilities.

**NFR-QUAL-002:** The application shall support responsive design for desktop, tablet, and mobile devices.

**NFR-QUAL-003:** Important actions shall be completed with minimum steps to improve user convenience.

**NFR-QUAL-004:** The system shall provide clear and concise error messages.

#### RELIABILITY

**NFR-QUAL-005:** The system shall maintain accurate order and delivery information during normal operation.

**NFR-QUAL-006:** The system shall recover from temporary failures without permanent data loss.

**NFR-QUAL-007:** The system should be available 24/7 with minimal downtime.

**NFR-QUAL-008:** The system shall maintain service availability during peak ordering periods.

#### MAINTAINABILITY

**NFR-QUAL-009:** The software architecture shall support future modifications and feature additions.

**NFR-QUAL-010:** The source code shall follow standard coding practices and documentation guidelines.

#### SCALABILITY

**NFR-QUAL-011:** The system design shall support adding more restaurants, delivery partners, and locations in future versions.

**NFR-QUAL-012:** The system shall support horizontal scaling to handle increased user load.

#### TESTABILITY

**NFR-QUAL-013:** Each major module shall be independently testable.

**NFR-QUAL-014:** The system shall support functional and integration testing.

### 5.5 Business Rules

The following business rules define how the Muncho system should operate.

#### ORDER RULES

**BR-001:** A customer must select a valid restaurant and items before placing an order.

**BR-002:** Orders can only be placed for available menu items.

**BR-003:** A customer cannot place multiple active orders for the same restaurant within a short period.

**BR-004:** Customers must provide a valid delivery address before placing an order.

**BR-005:** Order IDs shall be generated only after successful payment confirmation or cash on delivery selection.

**BR-006:** Orders shall be processed according to the order time.

**BR-007:** Restaurant partners shall have authority to accept, reject, or cancel orders.

**BR-008:** Delivery partners shall have authority to accept or reject delivery requests.

#### USER ROLE RULES

**BR-009:** Customers can only manage their own orders and profile.

**BR-010:** Restaurant partners cannot modify system-level configurations.

**BR-011:** Delivery partners cannot modify restaurant menus or customer profiles.

**BR-012:** Administrators have complete control over users, restaurants, delivery partners, and system settings.

#### SERVICE MANAGEMENT RULES

**BR-013:** Each restaurant shall have predefined working hours and delivery radius.

**BR-014:** Administrators shall configure service availability based on platform resources.

**BR-015:** Restaurants shall be responsible for maintaining accurate menu information.

#### ACCESSIBILITY RULES

**BR-016:** The system shall support customers who require assistance by allowing customer support-assisted ordering.

**BR-017:** The system shall provide clear information about delivery time and charges to avoid confusion.

---

## 6. Other Requirements

This section defines additional requirements that are not covered in the previous sections of the Software Requirements Specification. These requirements include database considerations, legal and compliance requirements, future scalability, and project-specific considerations.

### 6.1 Database Requirements

The Muncho system requires a structured database to store and manage information related to customers, restaurants, delivery partners, orders, and system activities.

The database shall maintain the following information:

#### User Information
- User ID
- Name
- Contact details
- Login credentials
- User role
- Delivery addresses

#### Restaurant Information
- Restaurant ID
- Restaurant name
- Description
- Cuisine type
- Location
- Rating
- Timings

#### Menu Information
- Item ID
- Item name
- Description
- Price
- Category
- Availability status

#### Order Information
- Order ID
- Customer ID
- Restaurant ID
- Items ordered
- Total price
- Delivery address
- Order status
- Payment status

#### Delivery Information
- Delivery ID
- Order ID
- Delivery partner ID
- Delivery status
- Delivery location
- Estimated delivery time

#### Feedback Information
- Feedback ID
- User ID
- Order ID
- Rating
- Review
- Suggestions

Database requirements:

**REQ-DB-001:** The system shall maintain data consistency between orders and delivery records.

**REQ-DB-002:** The database shall prevent duplicate records and maintain data integrity.

**REQ-DB-003:** The system shall support backup and recovery of stored information.

**REQ-DB-004:** The database design shall support future expansion to multiple locations and restaurant chains.

### 6.2 Scalability Requirements

The Muncho system shall be designed to support future growth and additional functionalities.

The system should support:
- Addition of new restaurants and cuisines.
- Expansion to multiple cities and locations.
- Increase in number of registered customers.
- Additional user roles in future versions.
- Integration with third-party services.

**REQ-SCALE-001:** The system architecture shall allow new modules to be added without major modifications to existing components.

**REQ-SCALE-002:** The system shall support horizontal scaling to handle increased traffic.

### 6.3 Localization Requirements

Since Muncho serves customers from different regions, the system should support multiple languages.

**REQ-LOC-001:** The user interface should support English and regional languages.

**REQ-LOC-002:** The system should use simple language and clear instructions suitable for users with limited technical knowledge.

Future versions may support:
- Tamil
- Hindi
- Malayalam
- Other regional languages

### 6.4 Legal and Compliance Requirements

The system shall follow applicable government and data protection guidelines.

Requirements:

**REQ-LEGAL-001:** The system shall ensure responsible handling of customer information.

**REQ-LEGAL-002:** The system shall collect only information required for providing food delivery services.

**REQ-LEGAL-003:** The system shall maintain confidentiality of personal information.

**REQ-LEGAL-004:** The system shall maintain records required for auditing and service tracking.

**REQ-LEGAL-005:** The system shall comply with food safety and delivery regulations.

### 6.5 Backup and Recovery Requirements

To prevent data loss, the system shall implement backup mechanisms.

**REQ-BACKUP-001:** The system shall maintain periodic backups of important data.

**REQ-BACKUP-002:** The system shall support recovery of order and delivery information after unexpected failures.

**REQ-BACKUP-003:** The system shall maintain backup logs for auditing purposes.

### 6.6 Future Enhancement Requirements

The following features are considered for future versions:

- Integration with restaurant POS systems.
- AI-based food recommendations.
- Loyalty and rewards programs.
- Subscription-based delivery plans.
- Voice-based ordering.
- AR/VR food previews.
- Multi-location restaurant management.
- Drone delivery integration.
---

## Appendix A: Glossary

| TERM | DEFINITION |
|------|------------|
| Muncho | Smart Food Delivery Application |
| SRS | Software Requirements Specification |
| Customer | A person who uses the system to order food |
| Restaurant Partner | Restaurant owner or manager responsible for preparing food |
| Delivery Partner | Delivery personnel responsible for delivering orders |
| Administrator | User responsible for managing system configuration and access control |
| Order | A request placed by a customer for food items |
| Order ID | A unique identifier assigned to each order |
| Menu | List of food items available at a restaurant |
| Cart | Temporary storage of selected items before order placement |
| Checkout | Process of confirming and paying for an order |
| Order Tracking | Real-time monitoring of order status |
| Delivery Tracking | Real-time monitoring of delivery status |
| Dashboard | User interface displaying relevant information and actions |
| Authentication | Process of verifying user identity before granting access |
| Authorization | Process of controlling user access based on permissions |
| API | Application Programming Interface used for communication between software components |
| Database | Structured storage system used for maintaining application data |
| UI | User Interface through which users interact with the system |
| UX | User Experience describing the overall interaction quality of users with the system |
| Agile | Software development methodology based on iterative development and continuous improvement |
| REST API | Web communication method used between frontend and backend systems |
| GPS | Global Positioning System used for location tracking |
| UPI | Unified Payments Interface for digital payments |
| POS | Point of Sale system used by restaurants |

---

## Appendix B: Analysis Models

### 1. SYSTEM ARCHITECTURE DIAGRAM

[INSERT SYSTEM ARCHITECTURE DIAGRAM HERE]

### 2. USE CASE DIAGRAM

**ACTORS:**
- Customer
- Restaurant Partner
- Delivery Partner
- Administrator

**MAJOR USE CASES:**

**CUSTOMER:**
- Register/Login
- Browse Restaurants
- Search Food
- View Menu
- Add to Cart
- Place Order
- Make Payment
- Track Order
- Give Feedback
- View Order History

**RESTAURANT PARTNER:**
- Register/Login
- Manage Menu
- View Orders
- Accept/Reject Orders
- Update Order Status
- View Analytics

**DELIVERY PARTNER:**
- Register/Login
- View Delivery Requests
- Accept/Reject Deliveries
- Update Delivery Status
- View Earnings

**ADMINISTRATOR:**
- Manage Users
- Manage Restaurants
- Manage Delivery Partners
- Monitor Orders
- Generate Reports
- Manage Offers

[INSERT USE CASE DIAGRAM HERE]

### 3. ENTITY RELATIONSHIP DIAGRAM

**Main Entities:**
- User (Customer)
- Restaurant
- Menu Item
- Order
- Delivery
- Feedback
- Payment

[INSERT ENTITY RELATIONSHIP DIAGRAM HERE]

### 4. DATA FLOW DIAGRAM

**LEVEL 0:**

[INSERT DATA FLOW DIAGRAM LEVEL 0 HERE]

**LEVEL 1:**

**PROCESSES:**
- User Management
- Restaurant Management
- Order Management
- Delivery Management
- Payment Processing
- Notification Management
- Reporting

[INSERT DATA FLOW DIAGRAM LEVEL 1 HERE]

---

## Appendix C: To Be Determined List

The following items require further analysis or confirmation during future development phases.

| NO. | TBD ITEM | STATUS |
|-----|----------|--------|
| TBD-001 | Final hosting platform for deployment | Pending |
| TBD-002 | SMS notification service provider | Pending |
| TBD-003 | Payment gateway integration | Pending |
| TBD-004 | Map service provider for delivery tracking | Pending |
| TBD-005 | Final language support requirements | Pending |
| TBD-006 | Database hosting and backup strategy | Pending |
| TBD-007 | Restaurant onboarding process | Pending |
| TBD-008 | Delivery partner verification process | Pending |
| TBD-009 | Commission structure for restaurants | Pending |
| TBD-010 | Delivery charge calculation model | Pending |

---

## Appendix D: User Personas

### Persona 1: Subhu

[INSERT SUBHU IMAGE HERE]

**Age:** 20 years
**Location:** Perundurai
**Occupation:** Student
**Marital Status:** Single

**Background:**
Subhu is a college student passionate about technology and self-development. With limited access to high-end devices, he seeks affordable and accessible tools for learning and development.

**Aspirations:**
Building a career in technology, teaching himself to code and design.

**Barriers:**
- Connectivity issues
- Language barriers
- Feature overload

**Usage Behavior:**
- Preference for low bandwidth, offline access
- Mobile-first devices

**Key Suggestion:**
Provide student-friendly offers and show the complete price before checkout.

**Frequency:** 3-5 times/week
**Platforms:** Zomato, Swiggy
**Ordering Time:** Lunch, dinner, late night
**Preferences:** Indian, fast food, South Indian
**Search:** Food/dish name, restaurant name

**Pain Points:**
- High delivery charges
- Hidden charges
- Long delivery time

**Important Features:**
- Easy search
- Filters and offers
- Recommendations

**Main Expectation:**
- Good food quality
- Reasonable price
- Reliable delivery

### Persona 2: Archana C R

[INSERT ARCHANA IMAGE HERE]

**Age:** 27 years
**Job:** Non-Systems Engineer at TCS
**Location:** Chennai

**Background:**
Archana is a Systems Engineer at TCS who has a busy and structured work routine. She occasionally orders food online, mainly when she does not have enough time or energy to prepare food after work. She prefers simple and reliable food-delivery experiences without too many complicated steps.

**Lifestyle and Values:**
- Follows a busy, work-focused lifestyle
- Values convenience and time-saving solutions
- Prefers familiar restaurants and food choices
- Looks for reliable service when ordering online
- Uses technology regularly but does not order food frequently

**Short-term Goals:**
- Order dinner quickly when needed
- Find suitable food without spending too much time searching
- Receive the order reliably and on time

**Long-term Goals:**
- Have a more convenient way to manage meals around her work schedule
- Avoid unnecessary effort while ordering food
- Get a consistently reliable food-delivery experience

**Barriers:**
- Orders food online only rarely
- May not always know which restaurant or food to choose
- Too many choices can make food discovery difficult
- Delivery delays can affect dinner plans

**Key Suggestion:**
Show accurate delivery times and provide better lunch-time offers.

### Persona 3: Lab Technician

[INSERT LAB TECHNICIAN IMAGE HERE]

**Age:** 20 years
**Location:** Perundurai
**Occupation:** Lab Technician

**Key Suggestion:**
Provide affordable delivery options and clearly show the total price before checkout.

**Frequency:** Once a week
**Platforms:** Zomato
**Ordering Time:** Dinner, occasionally lunch
**Preferences:** South Indian, Indian meals
**Search:** Food/dish name, restaurant name

**Pain Points:**
- High delivery and platform charges
- Hidden/extra charges at checkout
- Long delivery time
- Food prices higher than local restaurants

**Important Features:**
- Easy search
- Filters for price and distance
- Affordable offers and discounts
- Clear total price

**Main Expectation:**
- Good food quality
- Affordable overall price
- Reliable and timely delivery
- No unexpected charges

---

## Appendix E: Sprint Documentation

### Sprint 1

[INSERT SPRINT 1 BOARD IMAGE HERE]

**Sprint Goal:** Problem Discovery & Product Definition

**User Stories:**
- AU-9: Problem Discovery & Product Definition
- AU-11: Define the problem
- AU-14: Identify target users
- AU-12: Interview target users & identify painpoints
- AU-10: Summarize findings

**Status:** Completed

### Sprint 2

[INSERT SPRINT 2 BOARD IMAGE HERE]

**Sprint Goal:** Design Discovery & Restaurant Screens

**User Stories:**
- AU-21: Create Muncho Design System
- AU-26: Design Discovery & Restaurant Screens
- AU-31: Design Ordering Screens

**Status:** In Progress

### Sprint 3

[INSERT SPRINT 3 BOARD IMAGE HERE]

**Sprint Goal:** Interactive Prototype & UI States

**User Stories:**
- AU-36: Create Interactive Figma Prototype
- AU-46: Add UI States & Responsive Design
- AU-51: Conduct UI/UX Review

**Status:** In Progress

### Sprint 4

[INSERT SPRINT 4 BOARD IMAGE HERE]

**Sprint Goal:** Implementation Foundation

**User Stories:**
- AU-57: Implement Frontend & Backend Foundation
- AU-62: Implement Authentication & Restaurant Discovery
- AU-67: Implement Restaurant & Menu

**Status:** Completed

### Sprint 5

[INSERT SPRINT 5 BOARD IMAGE HERE]

**Sprint Goal:** Order & Cart Implementation

**User Stories:**
- AU-72: Implement Cart & Checkout
- AU-77: Implement Orders & User Profile
- AU-82: Test & Refine Application

**Status:** Completed

---

## Appendix F: User Stories

### Epic 1: Problem Discovery

**AU-9:** As a product team, we need to discover the problem space and define the product vision for Muncho.

**Acceptance Criteria:**
- Conduct user interviews
- Identify target users
- Document pain points
- Define product scope

**AU-11:** As a product manager, I want to define the problem statement clearly so that the team understands the core issue.

**Acceptance Criteria:**
- Problem statement documented
- Target audience defined
- Key challenges identified

**AU-14:** As a UX researcher, I want to identify target users so that we can design for their specific needs.

**Acceptance Criteria:**
- User personas created
- User demographics documented
- User needs and goals identified

**AU-12:** As a UX researcher, I want to interview target users and identify pain points so that we can address real user problems.

**Acceptance Criteria:**
- Conduct user interviews
- Document pain points
- Identify key insights

**AU-10:** As a product team, we need to summarize findings so that we can inform product decisions.

**Acceptance Criteria:**
- Research findings documented
- Key insights summarized
- Recommendations provided

### Epic 2: Design System & Screens

**AU-21:** As a UI designer, I want to create a design system for Muncho so that all screens have consistent styling.

**Acceptance Criteria:**
- Color palette defined
- Typography selected
- Component library created
- Design guidelines documented

**AU-26:** As a UI designer, I want to design discovery and restaurant screens so that users can easily find food.

**Acceptance Criteria:**
- Home screen designed
- Search screen designed
- Restaurant listing screen designed
- Restaurant menu screen designed

**AU-31:** As a UI designer, I want to design ordering screens so that users can easily place orders.

**Acceptance Criteria:**
- Cart screen designed
- Checkout screen designed
- Payment screen designed
- Order confirmation screen designed

### Epic 3: Prototype & UI States

**AU-36:** As a UI designer, I want to create an interactive Figma prototype so that stakeholders can experience the app flow.

**Acceptance Criteria:**
- All screens linked
- Interactions defined
- Prototype tested

**AU-46:** As a UI designer, I want to add UI states and responsive design so that the app works on all devices.

**Acceptance Criteria:**
- Loading states added
- Error states added
- Empty states added
- Responsive layouts created

**AU-51:** As a UX designer, I want to conduct UI/UX review so that we can identify and fix usability issues.

**Acceptance Criteria:**
- Usability testing conducted
- Feedback collected
- Issues documented
- Improvements implemented

### Epic 4: Implementation

**AU-57:** As a developer, I want to implement frontend and backend foundation so that we have a working base for the application.

**Acceptance Criteria:**
- React app initialized
- Node.js backend setup
- Database connected
- Basic API endpoints created

**AU-62:** As a developer, I want to implement authentication and restaurant discovery so that users can sign up and find restaurants.

**Acceptance Criteria:**
- User registration implemented
- User login implemented
- Restaurant listing implemented
- Search functionality implemented

**AU-67:** As a developer, I want to implement restaurant and menu so that users can view restaurant details and menus.

**Acceptance Criteria:**
- Restaurant detail page implemented
- Menu listing implemented
- Item detail view implemented
- Add to cart functionality implemented

**AU-72:** As a developer, I want to implement cart and checkout so that users can place orders.

**Acceptance Criteria:**
- Cart functionality implemented
- Checkout flow implemented
- Payment integration implemented
- Order placement implemented

**AU-77:** As a developer, I want to implement orders and user profile so that users can view their orders and manage their profile.

**Acceptance Criteria:**
- Order history implemented
- Order tracking implemented
- User profile implemented
- Address management implemented

**AU-82:** As a QA engineer, I want to test and refine the application so that it is ready for release.

**Acceptance Criteria:**
- Functional testing completed
- Integration testing completed
- Performance testing completed
- Bugs fixed

---

## Appendix G: Pain Points and Solutions

### Common Pain Points

| Pain Point | Solution |
|------------|----------|
| High delivery charges | Implement affordable delivery options and subscription plans |
| Hidden charges | Show complete price breakdown before checkout |
| Long delivery time | Provide accurate delivery time estimates and real-time tracking |
| Too many choices | Provide personalized recommendations and filters |
| Food quality issues | Implement rating and review system |
| Payment failures | Support multiple payment methods and secure gateways |
| Order tracking issues | Real-time GPS tracking and status updates |
| Customer support | Implement in-app chat and support system |

### Feature Priorities

| Feature | Priority |
|---------|----------|
| User Authentication | High |
| Restaurant Discovery | High |
| Menu Management | High |
| Order Placement | High |
| Payment Processing | High |
| Order Tracking | High |
| Delivery Management | High |
| Notifications | Medium |
| Feedback System | Medium |
| Admin Panel | Medium |
| Offers & Promotions | Medium |
| Loyalty Program | Low |
| AI Recommendations | Low |
---

## Appendix H: Sprint-wise Task Breakdown

### Sprint 1: Problem Discovery (Weeks 1-2)

| Task | Story Points | Status |
|------|--------------|--------|
| Conduct user interviews | 5 | Done |
| Identify target users | 3 | Done |
| Document pain points | 5 | Done |
| Define problem statement | 3 | Done |
| Summarize findings | 2 | Done |

### Sprint 2: Design Discovery (Weeks 3-4)

| Task | Story Points | Status |
|------|--------------|--------|
| Create design system | 8 | In Progress |
| Design discovery screens | 5 | In Progress |
| Design restaurant screens | 5 | In Progress |
| Design ordering screens | 5 | To Do |

### Sprint 3: Prototype (Weeks 5-6)

| Task | Story Points | Status |
|------|--------------|--------|
| Create interactive prototype | 8 | In Progress |
| Add UI states | 5 | In Progress |
| Add responsive design | 5 | To Do |
| Conduct UI/UX review | 3 | To Do |

### Sprint 4: Implementation Foundation (Weeks 7-8)

| Task | Story Points | Status |
|------|--------------|--------|
| Frontend foundation | 8 | Done |
| Backend foundation | 8 | Done |
| Authentication | 5 | Done |
| Restaurant discovery | 5 | Done |
| Restaurant & menu | 5 | Done |

### Sprint 5: Order & Cart (Weeks 9-10)

| Task | Story Points | Status |
|------|--------------|--------|
| Cart implementation | 5 | Done |
| Checkout implementation | 5 | Done |
| Order management | 5 | Done |
| User profile | 3 | Done |
| Testing & refinement | 8 | Done |

---

## Appendix I: Technical Architecture

### System Components

1. **Frontend (React.js)**
   - Customer web app
   - Restaurant partner dashboard
   - Delivery partner dashboard
   - Admin panel

2. **Mobile App (React Native)**
   - Customer mobile app
   - Delivery partner mobile app

3. **Backend (Node.js + Express.js)**
   - REST API server
   - Authentication service
   - Order management service
   - Delivery management service
   - Notification service

4. **Database (MongoDB)**
   - User collection
   - Restaurant collection
   - Menu collection
   - Order collection
   - Delivery collection
   - Feedback collection

5. **External Services**
   - Payment gateway (Razorpay/Stripe)
   - Map service (Google Maps)
   - SMS gateway
   - Email service
   - Push notification service

### System Architecture Diagram

[INSERT SYSTEM ARCHITECTURE DIAGRAM HERE]

### Data Flow

1. Customer places order
2. Order sent to restaurant
3. Restaurant accepts and prepares order
4. Delivery partner assigned
5. Delivery partner picks up order
6. Order delivered to customer
7. Payment processed
8. Feedback collected

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | User login |
| GET | /api/restaurants | Get all restaurants |
| GET | /api/restaurants/:id | Get restaurant details |
| GET | /api/restaurants/:id/menu | Get restaurant menu |
| POST | /api/orders | Place order |
| GET | /api/orders/:id | Get order details |
| PUT | /api/orders/:id/status | Update order status |
| POST | /api/delivery/accept | Accept delivery |
| PUT | /api/delivery/:id/status | Update delivery status |
| POST | /api/feedback | Submit feedback |
| GET | /api/admin/reports | Generate reports |

---

## Appendix J: Testing Strategy

### Testing Levels

1. **Unit Testing**
   - Individual components tested
   - API endpoints tested
   - Database operations tested

2. **Integration Testing**
   - Frontend-backend integration tested
   - Payment gateway integration tested
   - Map service integration tested

3. **System Testing**
   - End-to-end order flow tested
   - User roles tested
   - Performance tested

4. **Acceptance Testing**
   - User acceptance testing
   - Beta testing with real users

### Test Cases

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| TC-001 | User registration | Account created successfully |
| TC-002 | User login | User logged in |
| TC-003 | Restaurant search | Matching results displayed |
| TC-004 | Add to cart | Item added to cart |
| TC-005 | Place order | Order placed successfully |
| TC-006 | Payment processing | Payment successful |
| TC-007 | Order tracking | Real-time status displayed |
| TC-008 | Delivery update | Status updated |
| TC-009 | Feedback submission | Feedback stored |
| TC-010 | Admin login | Admin dashboard displayed |

### Performance Testing

| Metric | Target |
|--------|--------|
| Page load time | < 3 seconds |
| API response time | < 2 seconds |
| Order processing time | < 5 seconds |
| Concurrent users | 1000+ |

---

## Appendix K: Deployment Strategy

### Deployment Environments

1. **Development**
   - Local development servers
   - MongoDB local instance
   - Mock payment gateway

2. **Staging**
   - Cloud hosting (AWS/Heroku)
   - MongoDB Atlas
   - Test payment gateway

3. **Production**
   - Cloud hosting (AWS/Heroku)
   - MongoDB Atlas
   - Live payment gateway

### Deployment Pipeline

1. Code commit to GitHub
2. Automated tests run
3. Build created
4. Deploy to staging
5. Manual testing
6. Deploy to production

### Monitoring

- Server health monitoring
- API performance monitoring
- Error tracking
- User analytics

---

## Appendix L: Project Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| Sprint 1 | Weeks 1-2 | Problem Discovery |
| Sprint 2 | Weeks 3-4 | Design Discovery |
| Sprint 3 | Weeks 5-6 | Prototype Development |
| Sprint 4 | Weeks 7-8 | Implementation Foundation |
| Sprint 5 | Weeks 9-10 | Order & Cart Implementation |
| Sprint 6 | Weeks 11-12 | Testing & Refinement |
| Sprint 7 | Weeks 13-14 | Deployment & Launch |

---

## Appendix M: Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Payment gateway integration issues | Medium | High | Early integration testing |
| Delivery partner availability | Medium | High | Multiple delivery partners |
| Restaurant onboarding delays | Medium | Medium | Streamlined onboarding |
| Technical debt | Low | Medium | Regular code reviews |
| User adoption | Low | High | Marketing and promotions |
| Scalability issues | Low | High | Cloud infrastructure |
| Security breaches | Low | High | Regular security audits |

---

## Appendix N: Success Metrics

| Metric | Target |
|--------|--------|
| User registrations | 10,000+ in first 3 months |
| Daily orders | 1,000+ |
| Restaurant partners | 500+ |
| Delivery partners | 1,000+ |
| Customer satisfaction | 4.5+ rating |
| Delivery time | < 30 minutes average |
| Order completion rate | 95%+ |
| Repeat order rate | 60%+ |

---

## Appendix O: Future Roadmap

### Phase 1 (Current)
- Basic food delivery features
- Web and mobile app
- Payment integration

### Phase 2 (3-6 months)
- AI-based recommendations
- Loyalty program
- Subscription plans
- Multi-language support

### Phase 3 (6-12 months)
- Expansion to multiple cities
- Restaurant POS integration
- Voice ordering
- AR/VR food previews

### Phase 4 (12+ months)
- Drone delivery
- Autonomous delivery vehicles
- Global expansion
- Advanced analytics

---

**END OF DOCUMENT**

---

*This Software Requirements Specification (SRS) document for Muncho - Smart Food Delivery Application has been prepared in accordance with IEEE standards and is intended for all stakeholders involved in the development, testing, and deployment of the system.*

**Document Version:** 1.0
**Last Updated:** 17 July, 2026
**Prepared by:** Abishek Ramaswami, Akash K N, Akilan S G, Anbuselvan S
**Institution:** Kongu Engineering College