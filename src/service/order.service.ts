import { BadRequestError, NotFoundError } from '@ingeze/api-error'
import { OrderDto } from '../dtos/order.dto.js'
import { PaymentDto } from '../dtos/payment.dto.js'
import { OrderRepository } from '../repository/order.repository.js'
import { IOrder } from '../types/order.types.js'
import { IPayment, PaymentResponse, PaymentStatus } from '../types/payment.types.js'
import logger from '../utils/logger.js'

export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async createOrder(data: OrderDto): Promise<IOrder> {
    const productIds = data.items.map(p => p.productId)

    const stockMap = await this.orderRepository.checkStock(productIds)

    for (const item of data.items) {
      const stock = stockMap.get(item.productId) ?? 0
      if (stock <= 0) {
        throw new BadRequestError({
          productId: item.productId,
          reason: `Product "${item.title}" don't stock`
        })
      }

      if (item.quantity > stock) {
        throw new BadRequestError({
          productId: item.productId,
          reason: `Insufficient stock for product "${item.title}". Available ${stock}, Requested: ${item.quantity}`
        })
      }
    }

    const itemsWithOwner = await Promise.all(
      data.items.map(async(item) => ({
        ...item,
        owner: await this.orderRepository.getOwners(item.productId)
      }))
    )

    const total = data.items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    )
    const totalWithWax = total * 1.21 // 21% IVA

    const orderData: IOrder = {
      userId: data.userId,
      items: itemsWithOwner,
      total: total,
      totalWithWax: totalWithWax,
      status: 'pending',
      shippingAddress: data.shippingAddress
    }

    return await this.orderRepository.createOrder(orderData)
  }

  async processPayment(paymentData: PaymentDto, orderId: string): Promise<PaymentResponse> {
    const order = await this.orderRepository.findPendingOrderById(orderId)
    if (!order) throw new NotFoundError({ reason: 'Order not found or already processed' })

    let transactionId = ''
    let paymentStatus: PaymentStatus = 'processing'

    if (paymentData.method === 'credit_card') {
      logger.info('Processing credit card...')
      if (!paymentData.details?.cardNumber || !paymentData.details?.cvv) {
        throw new BadRequestError({ reason: 'Invalid credit card information' })
      }

      transactionId = `CC-${Date.now()}-${Math.random().toString(36)}`
      paymentStatus = Math.random() > 0.1 ? 'pending' : 'failed'

    } else if (paymentData.method === 'paypal') {
      logger.info('Processing PayPal...')

      transactionId = `PP-${Date.now()}-${Math.random().toString(36)}`
      paymentStatus = Math.random() > 0.1 ? 'pending' : 'failed'
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _exhaustiveCheck: never = paymentData
      throw new BadRequestError({ reason: 'Payment method not supported' })
    }

    if (paymentStatus === 'failed') {
      throw new BadRequestError({
        reason: 'Payment processing failed. Please verify your payment information.'
      })
    }

    const paymentRecord: IPayment = {
      orderId: orderId,
      method: paymentData.method,
      transactionId,
      amount: order.totalWithWax || order.total,
      currency: 'USD',
      status: paymentStatus,
      payerEmail: paymentData.method === 'paypal' ? 'demo@paypal.com' : undefined
    }

    return await this.orderRepository.createPaymentRecord(paymentRecord)
  }

  async confirmPayment(orderId: string): Promise<{ order: IOrder, payment: PaymentResponse }> {
    const successfulPayment = await this.orderRepository.getPendingPaymentByOrderId(orderId)
    if (!successfulPayment) {
      throw new NotFoundError({ reason: 'No successful payment found for this order' })
    }

    const updatedOrder = await this.orderRepository.processPaymentWithTransaction(orderId)
    if (!updatedOrder) {
      throw new BadRequestError({ reason: 'Failed to complete payment transaction' })
    }

    const updateProcessPayment = await this.orderRepository.updateProcessPaymentToStatusPaid(orderId)
    if (!updateProcessPayment) {
      throw new BadRequestError({ reason: 'Failed to update status in process payment' })
    }

    return {
      order: updatedOrder,
      payment: updateProcessPayment
    }
  }

  async getOrderPayments(orderId: string): Promise<IPayment[]> {
    const orders = await this.orderRepository.getPaymentsByOrderId(orderId)
    if (!orders) throw new NotFoundError({ reason: 'Orders not found' })
    return orders
  }
}
