import { Router } from 'express'
import { accessTokenMiddleware } from 'src/middleware/auth.middleware.js'
import { ProtectedController } from 'src/controller/protected.controller.js'
import { ProductsService } from 'src/service/protected.service.js'
import { ProductRepository } from 'src/repository/products.repository.js'

const controller = new ProtectedController(new ProductsService(new ProductRepository))

const protectedRoute = Router()

protectedRoute.get('/products', accessTokenMiddleware, controller.getAllProducts)
protectedRoute.post('/products', accessTokenMiddleware, controller.addProduct)

export default protectedRoute
