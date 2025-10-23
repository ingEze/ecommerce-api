# Mini E-commerce API

A **RESTful e-commerce API** built with **Node.js, TypeScript, Express and MongoDB**, designed to manage users, products, orders, simulated payments, wishlists and email verification.

The API is ready to integrate with any frontend, and will soon feature an interactive **landing page**.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.16-darkgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

---

## 🚀 Key Features

- **🔐 Complete Authentication System** with JWT, email verification and password recovery
- **👥 User Management** with roles (User/Admin) and profile updates
- **📦 Full Product CRUD** with advanced filters, search, pagination and stock control
- **🛒 Order System** with simulated payment processing (credit card and PayPal)
- **❤️ Wishlist** to save favorite products
- **📊 Advanced Logging** with Winston and structured error handling
- **✅ Strict Data Validation** with Zod schemas
- **📚 Interactive Documentation** with Swagger UI

---

## 📖 Documentation

Complete API documentation available in multiple languages:

> 🇬🇧 **[English Documentation](src/docs/documentation.en.md)** - Full guide in English
> 
> 🇪🇸 **[Documentación en Español](src/docs/documentation.es.md)** - Guía completa en español

### Swagger UI

Interactive API documentation with live testing:

```
https://ecommerce-api-nmfr.onrender.com/api-docs/
```

---

## ⚡ Quick Start

```bash
# Clone repository
git clone https://github.com/ingeze/ecommerce-api.git
cd ecommerce-api

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start API in development mode
npm run dev
```

The API will be available at `https://ecommerce-api-nmfr.onrender.com/`

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Backend** | Node.js, TypeScript, Express |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT, bcrypt, cookie-parser |
| **Validation** | Zod |
| **Email** | Nodemailer |
| **Logging** | Winston, Morgan |
| **Documentation** | Swagger UI, OpenAPI 3.0 |
| **Testing** | Vitest, Supertest |

---

## 🌐 Landing Page

- 🔗 [E-commerce API](https://ecommerce-api-page.vercel.app)

The landing page is currently in development and will offer:

- General API information and overview
- Quick access to interactive documentation
- Endpoint examples and usage guides
- Call-to-action buttons: "Get Started" to test the API


---

## 📌 Main Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `PATCH /auth/forgot-password` - Request password reset
- `POST /auth/refresh` - Refresh access token

### Products
- `GET /protected/products` - List products (with filters)
- `POST /protected/products` - Create product(s)
- `PATCH /protected/products/:id` - Update product
- `DELETE /protected/products/:id` - Delete product

### Orders
- `POST /orders` - Create order
- `POST /orders/:orderId/process-payment` - Process payment
- `POST /orders/:orderId/confirm-payment` - Confirm payment

### Wishlist
- `GET /wishlist` - Get user's wishlist
- `POST /wishlist/:productId` - Add to wishlist
- `DELETE /wishlist/:productId` - Remove from wishlist

For complete endpoint details, see the [full documentation](src/docs/documentation.en.md).

---

## 🐳 Docker Support

```bash
# Start services
npm run start:docker

# Stop services
npm run stop:docker
```

---

## 🧪 Testing

```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Conventions
- Use strict TypeScript
- Follow ESLint configuration
- Add tests for new features
- Document endpoints in Swagger

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Ezequiel Saucedo**

- Portfolio: []
- LinkedIn: [Ezequiel Saucedo](https://www.linkedin.com/in/ezequiel-rodrigo-saucedo-50451a294)
- GitHub: [@ingEze](https://github.com/ingEze)

---

## 📞 Contact

For questions or suggestions, please open an issue on GitHub or contact directly.

---

**⭐ If you find this project useful, consider giving it a star on GitHub!**
