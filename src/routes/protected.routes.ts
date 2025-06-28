import { Router } from 'express'
import { authWithRefreshMiddleware, roleSellerMiddleware } from 'src/middleware/index.js'
import { ProtectedController } from 'src/controller/products.controller.js'
import { ProductsService } from 'src/service/products.service.js'
import { ProductRepository } from 'src/repository/products.repository.js'

const controller = new ProtectedController(new ProductsService(new ProductRepository))

const protectedRoute = Router()

// Role @User
protectedRoute.get('/products', authWithRefreshMiddleware, controller.getAllProducts)

// Role @Seller
protectedRoute.post('/products', authWithRefreshMiddleware, roleSellerMiddleware, controller.addProduct)
protectedRoute.patch('/products', authWithRefreshMiddleware, roleSellerMiddleware, controller.updateProduct)

export default protectedRoute
