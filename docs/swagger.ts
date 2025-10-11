import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'
import { config } from 'src/config/index.js'

const URL = config.url.APP_URL || 'http://localhost:3033'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-commerce API',
            version: '1.0.0',
            description: "An e-commerce API built with Node.js, TypeScript, Express, and MongoDB. Features user & admin roles, product and order management, payment simulation, email verification, and more."
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
    apis: ['./src/routes/!(index).ts']
}

const swaggerSpec = swaggerJSDoc(options)

export const setupSwagger = (app: Express): void => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}