import { PaymentResponse } from '../types/payment.types.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toPaymentResponse(payment: any): PaymentResponse {
  return {
    paymentId: payment._id?.toString() ?? '',
    orderId: payment.orderId?.toString() ?? '',
    method: payment.method,
    amount: payment.amount,
    status: payment.status,
    currency: payment.currency,
    transactionId: payment.transactionId,
    createdAt: payment.createdAt
  }
}
