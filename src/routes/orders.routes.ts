import { Router } from 'express'
import { OrderController } from 'src/controller/order.controller.js'
import { authWithRefreshMiddleware } from 'src/middleware/authToken.middleware.js'
import { checkIsActive, roleUserMiddleware } from 'src/middleware/index.js'
import { OrderRepository } from 'src/repository/order.repository.js'
import { OrderService } from 'src/service/order.service.js'

const orderRoute = Router()

const controller = new OrderController(new OrderService(new OrderRepository()))

// Role @User
orderRoute.post('/', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.createOrder)

orderRoute.post('/:orderId/process-payment', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.processPayment)
orderRoute.post('/:orderId/confirm-payment', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.confirmPayment)

orderRoute.get('/:orderId/payments', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.getOrderPayments)
export default orderRoute
