import { Express } from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { config } from '../config/index.js'

const PORT = config.url.PORT
const URL = config.url.APP_URL || `http://localhost:${PORT}`

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ext = process.env.NODE_ENV === 'production' ? 'js' : 'ts'

const baseDir =
  process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '../dist/routes')
    : path.join(__dirname, '../routes')

const filePath = path.join(baseDir, `**/*.${ext}`)

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description: 'An e-commerce API built with Node.js, TypeScript, Express, and MongoDB. Features user & admin roles, product and order management, payment simulation, email verification, and more.'
    },
    servers: [
      {
        url: URL,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Local server'
      }
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints related to authentication and user management'
      },
      {
        name: 'Users',
        description: 'Endpoints for user account management'
      },
      {
        name: 'Orders',
        description: 'Endpoints related to order creation and management'
      },
      {
        name: 'Products',
        description: 'Endpoints related to product listing and management'
      },
      {
        name: 'Payments',
        description: 'Endpoints for payment processing and simulation'
      },
      {
        name: 'Wishlist',
        description: 'Endpoints for managing user wishlists – add, remove, and retrieve favorite products.'
      }
    ]
  },
  apis: [filePath]
}

const swaggerSpec = swaggerJSDoc(options)

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}
