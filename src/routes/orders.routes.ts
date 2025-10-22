import { Router } from 'express'
import { OrderController } from '../controller/order.controller.js'
import { authWithRefreshMiddleware } from '../middleware/authToken.middleware.js'
import { checkIsActive, roleUserMiddleware } from '../middleware/index.js'
import { OrderRepository } from '../repository/order.repository.js'
import { OrderService } from '../service/order.service.js'

const orderRoute = Router()
const controller = new OrderController(new OrderService(new OrderRepository()))

/**
 * @swagger
 * tags:
 *   name: "Orders"
 *   description: Endpoints for managing orders and payments
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     description: Creates a new order for the authenticated user.
 *     tags: ["Orders"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - items
 *               - status
 *               - shippingAddress
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "671f50b7d4dbeff95c3d9b33"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - title
 *                     - price
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "671f50b7d4dbeff95c3d9b33"
 *                     title:
 *                       type: string
 *                       example: "Wireless Mouse"
 *                     price:
 *                       type: number
 *                       example: 39.99
 *                     quantity:
 *                       type: number
 *                       example: 2
 *               total:
 *                 type: number
 *                 example: 79.98
 *               totalWithWax:
 *                 type: number
 *                 example: 83.98
 *               status:
 *                 type: string
 *                 enum: [pending, paid, shipped, complete, cancelled, failed]
 *                 example: pending
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "123 Main St"
 *                   city:
 *                     type: string
 *                     example: "New York"
 *                   zip:
 *                     type: string
 *                     example: "10001"
 *     responses:
 *       201:
 *         description: Order successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order created successfully"
 *                 orderId:
 *                   type: string
 *                   example: "6720a2b7d4dbeff95c3d9b44"
 *       400:
 *         description: Invalid order data
 *       401:
 *         description: Unauthorized
 */
orderRoute.post('/', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.createOrder)

/**
 * @swagger
 * /orders/{orderId}/process-payment:
 *   post:
 *     summary: Process payment for an existing order
 *     description: Processes a payment using credit card or PayPal for the given order.
 *     tags: ["Orders"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to process payment for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   method:
 *                     type: string
 *                     enum: [credit_card]
 *                     example: credit_card
 *                   details:
 *                     type: object
 *                     properties:
 *                       cardNumber:
 *                         type: string
 *                         example: "4111111111111111"
 *                       firstName:
 *                         type: string
 *                         example: "John"
 *                       lastName:
 *                         type: string
 *                         example: "Doe"
 *                       expiration:
 *                         type: string
 *                         example: "12/26"
 *                       cvv:
 *                         type: string
 *                         example: "123"
 *               - type: object
 *                 properties:
 *                   method:
 *                     type: string
 *                     enum: [paypal]
 *                     example: paypal
 *                   details:
 *                     type: object
 *                     properties:
 *                       transactionId:
 *                         type: string
 *                         example: "PAYID-MVXLJ4A0X12345"
 *                       payerEmail:
 *                         type: string
 *                         example: "user@example.com"
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Payment processed successfully"
 *                 paymentId:
 *                   type: string
 *                   example: "pay_123abc456"
 *       400:
 *         description: Invalid payment data
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */
orderRoute.post('/:orderId/process-payment', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.processPayment)

/**
 * @swagger
 * /orders/{orderId}/confirm-payment:
 *   post:
 *     summary: Confirm an order payment
 *     description: Confirms the payment after being processed successfully.
 *     tags: ["Orders"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to confirm payment for
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Payment confirmed successfully"
 *                 status:
 *                   type: string
 *                   example: "paid"
 *       400:
 *         description: Invalid confirmation request
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */
orderRoute.post('/:orderId/confirm-payment', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.confirmPayment)

/**
 * @swagger
 * /orders/{orderId}/payments:
 *   get:
 *     summary: Get all payments for a specific order
 *     description: Retrieves all payment attempts for the given order.
 *     tags: ["Orders"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order
 *     responses:
 *       200:
 *         description: List of payments related to the order
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   method:
 *                     type: string
 *                     example: "credit_card"
 *                   status:
 *                     type: string
 *                     example: "paid"
 *                   amount:
 *                     type: number
 *                     example: 120.50
 *                   transactionId:
 *                     type: string
 *                     example: "txn_abc123"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-10-08T15:23:45.000Z"
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */
orderRoute.get('/:orderId/payments', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.getOrderPayments)

export default orderRoute
