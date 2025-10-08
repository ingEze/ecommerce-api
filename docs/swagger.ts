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
        ]
    },
    apis: ['./src/routes/*.ts  ']
}

const swaggerSpec = swaggerJSDoc(options)

export const setupSwagger = (app: Express): void => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}