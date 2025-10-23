export const config = {
  db: {
    URI: process.env.MONGO_URI || 'mongodb://localhost:27017/mini-ecommerce-api'
  },
  url: {
    APP_URL: process.env.APP_URL || 'http://localhost',
    PORT: process.env.PORT || 3056
  },
  adminUser: {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@example.com',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'Admin123!',
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'Admin'
  },
  jwt: {
    AUTH_TOKEN_SECRET: process.env.AUTH_TOKEN_SECRET,
    AUTH_REFRESh_SECRET: process.env.REFRESH_AUTH_SECRET,
    RESET_TOKEN_SECRET: process.env.RESET_TOKEN_SECRET,
    ACCOUNT_ACTIVATE_SECRET: process.env.ACCOUNT_ACTIVATE_SECRET
  }
}
