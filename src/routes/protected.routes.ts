import { Router } from 'express'
import { accessTokenMiddleware } from 'src/middleware/auth.middleware.js'
import { ProtectedController } from 'src/controller/protected.controller.js'
import { ProtectedService } from 'src/service/protected.service.js'

const controller = new ProtectedController(new ProtectedService)

const protectedRoute = Router()

protectedRoute.get('/products', accessTokenMiddleware, controller.getAllProducts)

export default protectedRoute
