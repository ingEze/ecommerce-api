# E-commerce API

## 📋 Table of Contents

- [Features](#-features)
- [Technologies](#️-technologies)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Available Scripts](#-available-scripts)
- [Architecture](#️-architecture)
- [Endpoints](#-endpoints)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Products](#products)
  - [Orders](#orders)
  - [Wishlist](#wishlist)
- [Authentication System](#-authentication-system)
- [Logging and Monitoring](#-logging-and-monitoring)
- [Data Validation](#-data-validation)
- [Error Handling](#-error-handling)
- [Security](#-security)
- [Testing](#-testing)
- [Docker](#-docker)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)

---

## ✨ Features

### Main Functionalities

- **🔐 Complete Authentication System**
  - User registration with email verification
  - Login with JWT (Access + Refresh tokens)
  - Password recovery via email
  - Account activation via token

- **👥 User Management**
  - User roles (User/Admin)
  - Profile update (username, email, password)
  - Account activation/deactivation
  - Products per user

- **📦 Product Management**
  - Complete CRUD for products
  - Advanced search and filtering
  - Pagination
  - Soft delete for products
  - Stock control

- **🛒 Order System**
  - Order creation with stock validation
  - Simulated payment processing (credit card and PayPal)
  - Payment confirmation with atomic transactions
  - Payment history per order

- **❤️ Wishlist**
  - Add/remove favorite products
  - Query saved products

---

## 🛠️ Technologies

### Core
- **Node.js** (v20+) - JavaScript runtime
- **TypeScript** (v5.8) - Typed superset of JavaScript
- **Express** (v5.1) - Minimalist web framework

### Database
- **MongoDB** (v8.16) - NoSQL database
- **Mongoose** - ODM for MongoDB

### Authentication and Security
- **jsonwebtoken** - JWT generation and verification
- **bcrypt** - Password hashing
- **cookie-parser** - HTTP cookie handling

### Validation
- **Zod** (v3.25) - Schema and type validation

### Email
- **Nodemailer** (v7.0) - Email sending (verification and recovery)

### Logging and Monitoring
- **Winston** (v3.18) - Structured logging system
- **Morgan** (v1.10) - HTTP request logger

### Security
- **express-rate-limit** (v8.1) - Rate limiting
- **@ingeze/api-error** - Centralized error handling

### Documentation
- **Swagger UI Express** (v5.0) - Visual API interface
- **swagger-jsdoc** (v6.2) - OpenAPI documentation generation

### Development Tools
- **tsx** - TypeScript execution in development
- **esbuild** - Ultra-fast bundler
- **ESLint** - Code linter
- **Vitest** - Testing framework
- **Supertest** - HTTP endpoint testing

---

## 📥 Installation

### Prerequisites

- Node.js v20 or higher
- MongoDB v8 or higher (with configured replica set)
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/tu-usuario/ecommerce-api.git
cd ecommerce-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

4. **Configure MongoDB Replica Set** (required for transactions)
```bash
# Start MongoDB with replica set
mongod --replSet rs0
```

5. **Start the application**
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/mini-ecommerce-api?replicaSet=rs0

# Application
APP_URL=http://localhost:3033
PORT=3033

# Default admin (first user)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin123!

# JWT Secrets
AUTH_TOKEN_SECRET=your_auth_secret_key
REFRESH_TOKEN_SECRET=your_refresh_secret_key
RESET_TOKEN_SECRET=your_reset_secret_key
ACCOUNT_ACTIVATE_SECRET=your_activation_secret_key

# SMTP Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Gmail Configuration for SMTP

1. Enable two-step verification in your Google account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password
4. Use that password in `SMTP_PASS`

---

## 📜 Available Scripts

```bash
# Development with hot-reload
npm run dev

# Build for production
npm run build

# Run in production
npm start

# Clean build
npm run clean

# Complete rebuild
npm run rebuild

# Testing
npm test

# Docker
npm run start:docker    # Start containers
npm run stop:docker     # Stop containers
```

---

## 🗂️ Architecture

The project follows a clean and scalable layered architecture:

```
src/
├── config/           # Centralized configuration
├── controller/       # Controllers (route logic)
├── db/              # Database connection
├── dtos/            # Data Transfer Objects and validations
├── middleware/      # Custom middlewares
├── models/          # MongoDB/Mongoose schemas
├── repository/      # Data access layer
├── routes/          # Route definitions
├── service/         # Business logic
├── types/           # TypeScript types
└── utils/           # Utilities and helpers
```

### Data Flow

```
Request → Route → Middleware → Controller → Service → Repository → Database
                      ↓                                      ↑
                  Validation                             Response
```

---

## 📌 Endpoints

### Base URL
```
http://localhost:3033
```

### Authentication

#### `POST /auth/register`
Registers a new user and sends verification email.

**Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "Password123!"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "A verification email has been sent"
}
```

---

#### `POST /auth/login`
Logs in and sets authentication cookies.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successfully"
}
```

**Cookies:** `access_token`, `refresh_token`

---

#### `PATCH /auth/forgot-password`
Requests password recovery.

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`

---

#### `PATCH /auth/reset-password/:token`
Resets password using token from email.

**Body:**
```json
{
  "password": "NewPassword123!"
}
```

**Response:** `200 OK`

---

#### `POST /auth/refresh`
Refreshes access token using refresh token.

**Required cookies:** `refresh_token`

**Response:** `200 OK`

---

### Users

#### `PATCH /users/verify/:token`
Activates user account.

**Response:** `200 OK`

---

#### `GET /users/:username`
Gets products from a specific user.

**Query params:**
- `page` (default: 1)
- `limit` (default: 20)

**Authentication:** Required

---

#### `PATCH /users/me/username`
Updates username.

**Authentication:** Required

**Body:**
```json
{
  "username": "newusername",
  "password": "currentPassword"
}
```

---

#### `PATCH /users/me/password`
Updates password.

**Authentication:** Required

**Body:**
```json
{
  "password": "newPassword123!",
  "currentPassword": "oldPassword123!"
}
```

---

#### `PATCH /users/me/email`
Updates email.

**Authentication:** Required

**Body:**
```json
{
  "email": "newemail@example.com",
  "password": "currentPassword"
}
```

---

#### `PATCH /users/me/status`
Activates or deactivates account.

**Authentication:** Required

**Body:**
```json
{
  "isActive": true,
  "password": "currentPassword"
}
```

---

### Products

#### `GET /protected/products`
Gets paginated list of products with filters.

**Query params:**
- `page` (default: 1)
- `limit` (default: 20)
- `user` - Filter by username
- `search` - Search by title
- `minPrice` - Minimum price (or "free")
- `maxPrice` - Maximum price
- `sort` - `price_asc` or `price_desc`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalPage": 5,
    "totalProducts": 95
  },
  "data": {
    "products": [
      {
        "id": "...",
        "title": "Wireless Mouse",
        "price": 39.99,
        "description": "High-precision wireless mouse",
        "quantity": 10,
        "owner": {
          "id": "...",
          "username": "seller123"
        }
      }
    ]
  }
}
```

---

#### `GET /protected/products/:id`
Gets a product by ID.

**Response:** `200 OK`

---

#### `POST /protected/products`
Creates one or multiple products.

**Authentication:** Required (User/Admin)

**Body:**
```json
{
  "title": "Wireless Mouse",
  "price": 39.99,
  "description": "High-precision wireless mouse",
  "quantity": 10
}
```

Or an array of products:
```json
[
  { "title": "Product 1", "price": 10, "description": "...", "quantity": 5 },
  { "title": "Product 2", "price": 20, "description": "...", "quantity": 3 }
]
```

**Response:** `201 Created`

---

#### `PATCH /protected/products/:id`
Updates a product.

**Authentication:** Required (owner or Admin)

**Body:**
```json
{
  "title": "Updated Title",
  "price": 49.99
}
```

---

#### `DELETE /protected/products/:id`
Deletes a product (soft delete).

**Authentication:** Required (owner or Admin)

**Response:** `200 OK`

---

### Orders

#### `POST /orders`
Creates a new order.

**Authentication:** Required (User)

**Body:**
```json
{
  "items": [
    {
      "productId": "671f50b7d4dbeff95c3d9b33",
      "title": "Wireless Mouse",
      "price": 39.99,
      "quantity": 2
    }
  ],
  "status": "pending",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "orderId": "...",
    "total": 79.98,
    "totalWithWax": 96.48,
    "status": "pending"
  }
}
```

---

#### `POST /orders/:orderId/process-payment`
Processes order payment.

**Authentication:** Required (User)

**Body (Credit card):**
```json
{
  "method": "credit_card",
  "details": {
    "cardNumber": "4111111111111111",
    "firstName": "John",
    "lastName": "Doe",
    "expiration": "12/26",
    "cvv": "123"
  }
}
```

**Body (PayPal):**
```json
{
  "method": "paypal",
  "details": {
    "transactionId": "PAYID-MVXLJ4A0X12345",
    "payerEmail": "user@example.com"
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "paymentId": "...",
    "status": "pending",
    "transactionId": "CC-..."
  },
  "nextStep": {
    "action": "confirm_payment",
    "endpoint": "/orders/:orderId/confirm-payment"
  }
}
```

---

#### `POST /orders/:orderId/confirm-payment`
Confirms payment and updates stock.

**Authentication:** Required (User)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "order": {
      "orderId": "...",
      "status": "paid"
    },
    "payment": {
      "paymentId": "...",
      "status": "paid"
    }
  }
}
```

---

#### `GET /orders/:orderId/payments`
Gets payment history for an order.

**Authentication:** Required (User)

**Response:** `200 OK`

---

### Wishlist

#### `GET /wishlist`
Gets user's wishlist.

**Authentication:** Required (User)

**Response:** `200 OK`
```json
{
  "success": true,
  "products": [
    {
      "productId": "...",
      "title": "Wireless Mouse",
      "price": 39.99
    }
  ]
}
```

---

#### `POST /wishlist/:productId`
Adds a product to wishlist.

**Authentication:** Required (User)

**Response:** `200 OK`

---

#### `DELETE /wishlist/:productId`
Removes a product from wishlist.

**Authentication:** Required (User)

**Response:** `200 OK`

---

## 🔐 Authentication System

### JWT Strategy

The API uses a dual token system:

1. **Access Token** (15 minutes)
   - Stored in `httpOnly` cookie
   - Used to authenticate requests
   - Automatically refreshed if valid refresh token exists

2. **Refresh Token** (7 days)
   - Stored in `httpOnly` cookie
   - Used to generate new access tokens
   - Requires specific endpoint for manual refresh

### Authentication Middleware

- `accessTokenMiddleware` - Validates access token
- `refreshTokenMiddleware` - Validates refresh token
- `authWithRefreshMiddleware` - Auto-refreshes if access token expires
- `checkIsActive` - Verifies account is active
- `roleUserMiddleware` - Validates user role

---

## 📊 Logging and Monitoring

### Logging System with Winston

Logs are stored in:
```
logs/
├── error.log      # Errors only
└── combined.log   # All logs
```

### Log Levels

- **error**: Application errors
- **warn**: Warnings
- **info**: General information (HTTP requests)

### Request Logging with Morgan

All HTTP requests are automatically logged with:
- HTTP method
- URL
- Status code
- Response time
- User agent

---

## ✅ Data Validation

### Zod Schemas

All validation is done with Zod to ensure type-safety:

- **AuthDto**: Registration and login
- **ProductDto**: Product creation
- **OrderDto**: Order creation
- **PaymentDto**: Payment processing

### Implemented Validations

- Valid emails
- Passwords minimum 8 characters
- Usernames 3-20 characters
- Positive prices
- Positive quantities
- Credit card formats

---

## ⚠️ Error Handling

### Custom Errors

The API uses `@ingeze/api-error` for centralized handling:

- `BadRequestError` (400)
- `UnauthorizedError` (401)
- `ForbiddenUserError` (403)
- `NotFoundError` (404)
- `ValidationError` (422)
- `InternalServerError` (500)

### Error Response Format

```json
{
  "success": false,
  "error": {
    "type": "BadRequestError",
    "message": "Invalid product data",
    "details": {
      "reason": "..."
    }
  }
}
```

---

## 🔒 Security

### Implemented Measures

1. **Rate Limiting**
   - Global: 100 requests / 15 minutes
   - Auth endpoints: 5 requests / 5 minutes
   - Forgot password: 5 requests / 10 minutes

2. **Password Security**
   - Bcrypt with salt rounds = 10
   - Complexity validation

3. **JWT Security**
   - Tokens signed with secure secrets
   - Automatic expiration
   - httpOnly cookies

4. **Input Validation**
   - Strict validation with Zod
   - Data sanitization

5. **MongoDB Security**
   - Parameterized queries
   - NoSQL injection prevention

---

## 🧪 Testing

### Framework: Vitest + Supertest

```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Test Example

```typescript
import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/main'

describe('GET /protected/products', () => {
  it('should return products list', async () => {
    const response = await request(app)
      .get('/protected/products')
      .expect(200)
    
    expect(response.body.success).toBe(true)
    expect(response.body.data.products).toBeInstanceOf(Array)
  })
})
```

---

## 🐳 Docker

### Docker Compose

```bash
# Start services
npm run start:docker

# Stop services
npm run stop:docker
```

### Included Services

- **API**: Node.js application
- **MongoDB**: Database with replica set

---

## 📚 API Documentation

### Swagger UI

Interactive documentation is available at:

```
http://localhost:3033/api-docs
```

### Features

- Interactive endpoint exploration
- Request/response schemas
- Live testing
- OpenAPI 3.0 documentation
