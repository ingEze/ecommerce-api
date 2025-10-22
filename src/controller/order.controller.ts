import { ValidationError } from '@ingeze/api-error'
import { Request, Response, NextFunction } from 'express'
import { OrderDto, ValidateOrder } from '../dtos/order.dto.js'
import { ValidatePayment } from '../dtos/payment.dto.js'
import { OrderService } from '../service/order.service.js'
import { getCurrentUserById } from '../utils/getCurrentUserID.js'

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  createOrder = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getCurrentUserById(req)
      const data = req.body

      const orderDto: OrderDto = {
        ...data,
        userId
      }

      const validatedOrder = ValidateOrder(orderDto)
      if (!validatedOrder) throw new ValidationError({ reason: validatedOrder })

      const newOrder = await this.orderService.createOrder(validatedOrder)

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: newOrder
      })
    } catch (err) {
      next(err)
    }
  }

  processPayment = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { orderId } = req.params
      const paymentData = ValidatePayment(req.body)

      const paymentResult = await this.orderService.processPayment(paymentData, orderId)

      res.status(200).json({
        success: true,
        message: 'Payment processed successfully',
        data: paymentResult,
        nextStep: {
          action: 'confirm_payment',
          endpoint: `/orders/${orderId}/confirm-payment`,
          description: 'Call this endpoint to finalize the transaction'
        }
      })
    } catch (err) {
      next(err)
    }
  }

  confirmPayment = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { orderId } = req.params

      const result = await this.orderService.confirmPayment(orderId)

      res.status(201).json({
        success: true,
        data: result
      })
    } catch (err) {
      next(err)
    }
  }

  getOrderPayments =  async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { orderId } = req.params
      const payments = await this.orderService.getOrderPayments(orderId)

      res.status(200).json({
        success: true,
        data: payments
      })
    } catch (err) {
      next(err)
    }
  }
}
