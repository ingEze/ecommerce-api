import dotenv from 'dotenv'
dotenv.config()

export const config = {
  db: {
    URI: process.env.MONGO_URI || 'mongodb://localhost:27017/mini-ecommerce-api'
  },
  adminUser: {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@example.com',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin123!'
  },
  jwt: {
    AUTH_TOKEN_SECRET: process.env.AUTH_TOKEN_SECRET,
    AUTH_REFRESh_SECRET: process.env.REFRESH_AUTH_SECRET
  }
}
