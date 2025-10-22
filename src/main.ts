import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { expressErrorMiddleware } from '@ingeze/api-error/express'
import { authRoute, orderRoute, productsRoute, userRoute, wishlistRoute } from './routes/index.js'
import { setupSwagger } from './docs/swagger.js'
import { connectDB } from './db/mongoDB/connectDB.js'
import { createAdminIfNotExists } from './utils/firstUserAdmin.js'
import { config } from './config/index.js'
import { globalRateLimiter } from './middleware/rateLimit.middleware.js'
import { morganMiddleware, errorLogger } from './middleware/index.js'
import logger from './utils/logger.js'
import { createDemoUser } from './utils/createTestUser.js'
import { myCors } from './utils/cors.js'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors(myCors()))

app.use(globalRateLimiter)
app.use(morganMiddleware)
app.use(express.json())
app.use(cookieParser())

connectDB()
await createAdminIfNotExists()
await createDemoUser()
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
  logger.info(`server running on ${URL}:${PORT}`)
  logger.info(`Swagger docs at ${URL}:${PORT}/api-docs`)
})

