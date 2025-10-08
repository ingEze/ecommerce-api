import express from 'express'
import cookieParser from 'cookie-parser'
import { expressErrorMiddleware } from '@ingeze/api-error/express'

import { authRoute, orderRoute, productsRoute, userRoute, wishlistRoute } from './routes/index.js'

import { setupSwagger } from '../docs/swagger.js'

import { connectDB } from './db/mongoDB/connectDB.js'
import { createAdminIfNotExists } from './utils/firstUserAdmin.js'
import { config } from './config/index.js'
import { globalRateLimiter } from './middleware/rateLimit.middleware.js'

const app = express()
app.use(globalRateLimiter)
app.use(express.json())
app.use(cookieParser())

connectDB()
await createAdminIfNotExists()

setupSwagger(app)

app.use('/auth', authRoute)
app.use('/protected', productsRoute)
app.use('/users', userRoute)
app.use('/orders', orderRoute)
app.use('/wishlist', wishlistRoute)

app.use(expressErrorMiddleware)

const PORT = config.url.PORT
const URL = config.url.APP_URL
app.listen(PORT, () => {
  console.log(`server running on ${URL}:${PORT}`)
  console.log(`Swagger docs at ${URL}:${PORT}/api-docs`)
})
