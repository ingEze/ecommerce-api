import { NotFoundError } from '@ingeze/api-error'
import mongoose from 'mongoose'
import { Orders } from '../models/orders.schema.js'
import { ProcessPayment } from '../models/processPayment.schema.js'
import { Products } from '../models/product.schema.js'
import { IOrder } from '../types/order.types.js'
import { IPayment, PaymentResponse } from '../types/payment.types.js'
import logger from '../utils/logger.js'
import { toPaymentResponse } from '../utils/toPaymentRecord.js'

export class OrderRepository {
  async checkStock(productsId: string[]): Promise<Map<string, number>> {
    const products = await Products.find({ _id: { $in: productsId } })

    const stockMap = new Map(
      products.map(p => [p._id.toString(), p.quantity])
    )

    return stockMap
  }

  async createOrder(data: IOrder): Promise<IOrder> {
    return await Orders.create(data)
  }

  async findPendingOrderById(orderId: string): Promise<IOrder | null> {
    return await Orders.findOne(
      { _id: orderId, status: 'pending' }
    ).lean<IOrder>()
  }

  async getOwners(productId: string): Promise<string> {
    const product = await Products.findOne(
      { _id: productId },
      { owner: 1, _id: 0 }
    ).lean()
    if (!product) throw new NotFoundError({ reason: 'Product not found' })

    return product?.owner.toString()
  }

  async getPaymentsByOrderId(orderId: string): Promise<IPayment[] | null> {
    return await ProcessPayment.find({ orderId: orderId })
  }

  async getPendingPaymentByOrderId(orderId: string): Promise<PaymentResponse | null> {
    return await ProcessPayment.findOne(
      { orderId: orderId, status: 'pending' }
    ).lean<PaymentResponse>()
  }

  async processPaymentWithTransaction(orderId: string): Promise<IOrder | null> {
    const session = await mongoose.startSession()

    try {
      session.startTransaction()

      const order = await Orders.findOne(
        { _id: orderId, status: 'pending' }
      )
      if (!order) throw new NotFoundError({ reason: 'Order not found' })

      for (const item of order.items) {
        await Products.findByIdAndUpdate(
          item.productId,
          { $inc: { quantity: (-item.quantity || 1) } },
          { session }
        )
      }

      const updateOrder = await Orders.findByIdAndUpdate(
        orderId,
        { status: 'paid' },
        { new: true, session }
      )

      await session.commitTransaction()

      return updateOrder
    } catch (err) {
      logger.error(err)
      session.abortTransaction()
      throw err
    } finally {
      session.endSession()
    }
  }

  async updateProcessPaymentToStatusPaid(orderId: string): Promise<PaymentResponse | null> {
    return await ProcessPayment.findOneAndUpdate(
      { orderId: orderId, status: 'pending' },
      { status: 'paid' },
      { new: true }
    )
  }

  async createPaymentRecord(paymentData: IPayment): Promise<PaymentResponse> {
    const payment = await ProcessPayment.create(paymentData)
    return toPaymentResponse(payment.toObject())
  }

  async getPaymentTransactionById(transactionId: string): Promise<IPayment | null> {
    return ProcessPayment.findOne({ transactionId: transactionId }).lean<IPayment>()
  }
}
