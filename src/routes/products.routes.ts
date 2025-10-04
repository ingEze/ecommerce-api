import { Router } from 'express'
import { authWithRefreshMiddleware, checkIsActive, roleUserMiddleware } from 'src/middleware/index.js'
import { ProtectedController } from 'src/controller/products.controller.js'
import { ProductsService } from 'src/service/products.service.js'
import { ProductRepository } from 'src/repository/products.repository.js'

const controller = new ProtectedController(new ProductsService(new ProductRepository))

const productsRoute = Router()

// Role @Guest
productsRoute.get('/products', controller.getAllProducts)
productsRoute.get('/products/:id', controller.getProductById)

// Role @User
productsRoute.post('/products', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.addProduct)
productsRoute.patch('/products/:id', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.updateProduct)
productsRoute.delete('/products/:id', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.deletedProduct)

export default productsRoute
