# E-commerce API

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#️-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Scripts Disponibles](#-scripts-disponibles)
- [Arquitectura](#-arquitectura)
- [Endpoints](#-endpoints)
  - [Autenticación](#autenticación)
  - [Usuarios](#usuarios)
  - [Productos](#productos)
  - [Órdenes](#órdenes)
  - [Wishlist](#wishlist)
- [Sistema de Autenticación](#-sistema-de-autenticación)
- [Logging y Monitoreo](#-logging-y-monitoreo)
- [Validación de Datos](#-validación-de-datos)
- [Manejo de Errores](#-manejo-de-errores)
- [Seguridad](#-seguridad)
- [Testing](#-testing)
- [Docker](#-docker)
- [Documentación API](#-documentación-api)
- [Contribuir](#-contribuir)

---

## ✨ Características

### Funcionalidades Principales

- **🔐 Sistema de Autenticación Completo**
  - Registro de usuarios con verificación de email
  - Login con JWT (Access + Refresh tokens)
  - Recuperación de contraseña por email
  - Activación de cuenta mediante token

- **👥 Gestión de Usuarios**
  - Roles de usuario (User/Admin)
  - Actualización de perfil (username, email, contraseña)
  - Activación/desactivación de cuenta
  - Productos por usuario

- **📦 Gestión de Productos**
  - CRUD completo de productos
  - Búsqueda y filtrado avanzado
  - Paginación
  - Soft delete de productos
  - Control de stock

- **🛒 Sistema de Órdenes**
  - Creación de órdenes con validación de stock
  - Procesamiento de pagos simulados (tarjeta de crédito y PayPal)
  - Confirmación de pagos con transacciones atómicas
  - Historial de pagos por orden

- **❤️ Lista de Deseos**
  - Agregar/eliminar productos favoritos
  - Consulta de productos guardados

---

## 🛠️ Tecnologías

### Core
- **Node.js** (v20+) - Runtime de JavaScript
- **TypeScript** (v5.8) - Superset tipado de JavaScript
- **Express** (v5.1) - Framework web minimalista

### Base de Datos
- **MongoDB** (v8.16) - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB

### Autenticación y Seguridad
- **jsonwebtoken** - Generación y verificación de JWT
- **bcrypt** - Hashing de contraseñas
- **cookie-parser** - Manejo de cookies HTTP

### Validación
- **Zod** (v3.25) - Validación de schemas y tipos

### Email
- **Nodemailer** (v7.0) - Envío de emails (verificación y recuperación)

### Logging y Monitoreo
- **Winston** (v3.18) - Sistema de logs estructurados
- **Morgan** (v1.10) - HTTP request logger

### Seguridad
- **express-rate-limit** (v8.1) - Rate limiting
- **@ingeze/api-error** - Manejo centralizado de errores

### Documentación
- **Swagger UI Express** (v5.0) - Interfaz visual de API
- **swagger-jsdoc** (v6.2) - Generación de documentación OpenAPI

### Herramientas de Desarrollo
- **tsx** - Ejecución de TypeScript en desarrollo
- **esbuild** - Bundler ultra-rápido
- **ESLint** - Linter de código
- **Vitest** - Framework de testing
- **Supertest** - Testing de endpoints HTTP

---

## 📥 Instalación

### Prerequisitos

- Node.js v20 o superior
- MongoDB v8 o superior (con replica set configurado)
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/ecommerce-api.git
cd ecommerce-api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

4. **Configurar MongoDB Replica Set** (requerido para transacciones)
```bash
# Iniciar MongoDB con replica set
mongod --replSet rs0
```

5. **Iniciar la aplicación**
```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/mini-ecommerce-api?replicaSet=rs0

# Application
APP_URL=http://localhost:3033
PORT=3033

# Admin por defecto (primer usuario)
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

### Configuración de Gmail para SMTP

1. Habilita la verificación en dos pasos en tu cuenta de Google
2. Ve a [App Passwords](https://myaccount.google.com/apppasswords)
3. Genera una nueva contraseña de aplicación
4. Usa esa contraseña en `SMTP_PASS`

---

## 📜 Scripts Disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Build para producción
npm run build

# Ejecutar en producción
npm start

# Limpiar build
npm run clean

# Rebuild completo
npm run rebuild

# Testing
npm test

# Docker
npm run start:docker    # Iniciar contenedores
npm run stop:docker     # Detener contenedores
```

---

## 🏗️ Arquitectura

El proyecto sigue una arquitectura en capas limpia y escalable:

```
src/
├── config/           # Configuración centralizada
├── controller/       # Controladores (lógica de rutas)
├── db/              # Conexión a base de datos
├── dtos/            # Data Transfer Objects y validaciones
├── middleware/      # Middlewares personalizados
├── models/          # Schemas de MongoDB/Mongoose
├── repository/      # Capa de acceso a datos
├── routes/          # Definición de rutas
├── service/         # Lógica de negocio
├── types/           # Tipos de TypeScript
└── utils/           # Utilidades y helpers
```

### Flujo de Datos

```
Request → Route → Middleware → Controller → Service → Repository → Database
                      ↓                                      ↑
                  Validation                             Response
```

---

## 🔌 Endpoints

### Base URL
```
http://localhost:3033
```

### Autenticación

#### `POST /auth/register`
Registra un nuevo usuario y envía email de verificación.

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
Inicia sesión y establece cookies de autenticación.

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
Solicita recuperación de contraseña.

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`

---

#### `PATCH /auth/reset-password/:token`
Restablece la contraseña usando el token del email.

**Body:**
```json
{
  "password": "NewPassword123!"
}
```

**Response:** `200 OK`

---

#### `POST /auth/refresh`
Refresca el access token usando el refresh token.

**Cookies requeridas:** `refresh_token`

**Response:** `200 OK`

---

### Usuarios

#### `PATCH /users/verify/:token`
Activa la cuenta del usuario.

**Response:** `200 OK`

---

#### `GET /users/:username`
Obtiene productos de un usuario específico.

**Query params:**
- `page` (default: 1)
- `limit` (default: 20)

**Autenticación:** Requerida

---

#### `PATCH /users/me/username`
Actualiza el nombre de usuario.

**Autenticación:** Requerida

**Body:**
```json
{
  "username": "newusername",
  "password": "currentPassword"
}
```

---

#### `PATCH /users/me/password`
Actualiza la contraseña.

**Autenticación:** Requerida

**Body:**
```json
{
  "password": "newPassword123!",
  "currentPassword": "oldPassword123!"
}
```

---

#### `PATCH /users/me/email`
Actualiza el email.

**Autenticación:** Requerida

**Body:**
```json
{
  "email": "newemail@example.com",
  "password": "currentPassword"
}
```

---

#### `PATCH /users/me/status`
Activa o desactiva la cuenta.

**Autenticación:** Requerida

**Body:**
```json
{
  "isActive": true,
  "password": "currentPassword"
}
```

---

### Productos

#### `GET /protected/products`
Obtiene lista paginada de productos con filtros.

**Query params:**
- `page` (default: 1)
- `limit` (default: 20)
- `user` - Filtrar por username
- `search` - Búsqueda por título
- `minPrice` - Precio mínimo (o "free")
- `maxPrice` - Precio máximo
- `sort` - `price_asc` o `price_desc`

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
Obtiene un producto por ID.

**Response:** `200 OK`

---

#### `POST /protected/products`
Crea uno o varios productos.

**Autenticación:** Requerida (User/Admin)

**Body:**
```json
{
  "title": "Wireless Mouse",
  "price": 39.99,
  "description": "High-precision wireless mouse",
  "quantity": 10
}
```

O un array de productos:
```json
[
  { "title": "Product 1", "price": 10, "description": "...", "quantity": 5 },
  { "title": "Product 2", "price": 20, "description": "...", "quantity": 3 }
]
```

**Response:** `201 Created`

---

#### `PATCH /protected/products/:id`
Actualiza un producto.

**Autenticación:** Requerida (propietario o Admin)

**Body:**
```json
{
  "title": "Updated Title",
  "price": 49.99
}
```

---

#### `DELETE /protected/products/:id`
Elimina un producto (soft delete).

**Autenticación:** Requerida (propietario o Admin)

**Response:** `200 OK`

---

### Órdenes

#### `POST /orders`
Crea una nueva orden.

**Autenticación:** Requerida (User)

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
Procesa el pago de una orden.

**Autenticación:** Requerida (User)

**Body (Tarjeta de crédito):**
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
Confirma el pago y actualiza el stock.

**Autenticación:** Requerida (User)

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
Obtiene historial de pagos de una orden.

**Autenticación:** Requerida (User)

**Response:** `200 OK`

---

### Wishlist

#### `GET /wishlist`
Obtiene la lista de deseos del usuario.

**Autenticación:** Requerida (User)

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
Agrega un producto a la wishlist.

**Autenticación:** Requerida (User)

**Response:** `200 OK`

---

#### `DELETE /wishlist/:productId`
Elimina un producto de la wishlist.

**Autenticación:** Requerida (User)

**Response:** `200 OK`

---

## 🔐 Sistema de Autenticación

### JWT Strategy

La API utiliza un sistema de doble token:

1. **Access Token** (15 minutos)
   - Almacenado en cookie `httpOnly`
   - Usado para autenticar requests
   - Se refresca automáticamente si existe refresh token válido

2. **Refresh Token** (7 días)
   - Almacenado en cookie `httpOnly`
   - Usado para generar nuevos access tokens
   - Requiere endpoint específico para refresco manual

### Middleware de Autenticación

- `accessTokenMiddleware` - Valida access token
- `refreshTokenMiddleware` - Valida refresh token
- `authWithRefreshMiddleware` - Auto-refresca si access token expira
- `checkIsActive` - Verifica que la cuenta esté activa
- `roleUserMiddleware` - Valida rol de usuario

---

## 📊 Logging y Monitoreo

### Sistema de Logs con Winston

Los logs se almacenan en:
```
logs/
├── error.log      # Solo errores
└── combined.log   # Todos los logs
```

### Niveles de Log

- **error**: Errores de aplicación
- **warn**: Advertencias
- **info**: Información general (requests HTTP)

### Request Logging con Morgan

Todos los requests HTTP se registran automáticamente con:
- Método HTTP
- URL
- Status code
- Tiempo de respuesta
- User agent

---

## ✅ Validación de Datos

### Zod Schemas

Toda la validación se realiza con Zod para garantizar type-safety:

- **AuthDto**: Registro y login
- **ProductDto**: Creación de productos
- **OrderDto**: Creación de órdenes
- **PaymentDto**: Procesamiento de pagos

### Validaciones Implementadas

- Emails válidos
- Passwords mínimo 8 caracteres
- Usernames 3-20 caracteres
- Precios positivos
- Cantidades positivas
- Formatos de tarjeta de crédito

---

## ⚠️ Manejo de Errores

### Errores Personalizados

La API utiliza `@ingeze/api-error` para manejo centralizado:

- `BadRequestError` (400)
- `UnauthorizedError` (401)
- `ForbiddenUserError` (403)
- `NotFoundError` (404)
- `ValidationError` (422)
- `InternalServerError` (500)

### Formato de Respuesta de Error

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

## 🔒 Seguridad

### Medidas Implementadas

1. **Rate Limiting**
   - Global: 100 requests / 15 minutos
   - Auth endpoints: 5 requests / 5 minutos
   - Forgot password: 5 requests / 10 minutos

2. **Password Security**
   - Bcrypt con salt rounds = 10
   - Validación de complejidad

3. **JWT Security**
   - Tokens firmados con secrets seguros
   - Expiración automática
   - Cookies httpOnly

4. **Input Validation**
   - Validación estricta con Zod
   - Sanitización de datos

5. **MongoDB Security**
   - Queries parametrizadas
   - Prevención de NoSQL injection

---

## 🧪 Testing

### Framework: Vitest + Supertest

```bash
# Ejecutar tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

### Ejemplo de Test

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
# Iniciar servicios
npm run start:docker

# Detener servicios
npm run stop:docker
```

### Servicios Incluidos

- **API**: Node.js application
- **MongoDB**: Base de datos con replica set

---

## 📚 Documentación API

### Swagger UI

La documentación interactiva está disponible en:

```
http://localhost:3033/api-docs
```

### Características

- Exploración interactiva de endpoints
- Schemas de request/response
- Pruebas en vivo
- Documentación OpenAPI 3.0
