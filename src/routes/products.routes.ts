import { Router } from 'express'
import { authWithRefreshMiddleware, roleSellerMiddleware } from 'src/middleware/index.js'
import { ProtectedController } from 'src/controller/products.controller.js'
import { ProductsService } from 'src/service/products.service.js'
import { ProductRepository } from 'src/repository/products.repository.js'

const controller = new ProtectedController(new ProductsService(new ProductRepository))

const productsRoute = Router()

// Role @User
productsRoute.get('/products', authWithRefreshMiddleware, controller.getAllProducts)
productsRoute.get('/products/:id', authWithRefreshMiddleware, controller.getProductById)

// Role @Seller
productsRoute.post('/products', authWithRefreshMiddleware, roleSellerMiddleware, controller.addProduct)
productsRoute.patch('/products/:id', authWithRefreshMiddleware, roleSellerMiddleware, controller.updateProduct)
productsRoute.delete('/products/:id', authWithRefreshMiddleware, roleSellerMiddleware, controller.deletedProduct)

export default productsRoute
