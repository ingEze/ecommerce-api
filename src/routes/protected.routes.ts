import { Router } from 'express'
import { accessTokenMiddleware } from 'src/middleware/auth.middleware.js'

const protectedRoute = Router()

protectedRoute.get('/main', accessTokenMiddleware)

export default protectedRoute
