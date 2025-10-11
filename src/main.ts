import express from 'express'
import cookieParser from 'cookie-parser'
import { expressErrorMiddleware } from '@ingeze/api-error/express'

import { authRoute, orderRoute, productsRoute, userRoute, wishlistRoute } from './routes/index'

import { setupSwagger } from '../docs/swagger'

import { connectDB } from './db/mongoDB/connectDB'
import { createAdminIfNotExists } from './utils/firstUserAdmin'
import { config } from './config/index'
import { globalRateLimiter } from './middleware/rateLimit.middleware'
import { morganMiddleware } from './middleware/morgan.middleware'
import { errorLogger } from './middleware/errorLogger.middleware'

const app = express()

app.use(globalRateLimiter)
app.use(morganMiddleware)
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

app.use(errorLogger)
app.use(expressErrorMiddleware)

export default app

const PORT = config.url.PORT
const URL = config.url.APP_URL
app.listen(PORT, () => {
  console.log(`server running on ${URL}:${PORT}`)
  console.log(`Swagger docs at ${URL}:${PORT}/api-docs`)
})

