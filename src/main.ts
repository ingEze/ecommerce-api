import express from 'express'
import cookieParser from 'cookie-parser'
import { expressErrorMiddleware } from '@ingeze/api-error/express'

import { authRoute, productsRoute } from './routes/index.js'

import { connectDB } from './db/mongoDB/connectDB.js'

const app = express()
app.use(express.json())
app.use(cookieParser())

connectDB()

app.use('/auth', authRoute)
app.use('/protected', productsRoute)

app.use(expressErrorMiddleware)

const PORT = process.env.PORT || 3033
app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`)
})
