import mongoose from 'mongoose'

export type PaymentStatus = 'processing' | 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled'

interface BasePayment {
  orderId: mongoose.Types.ObjectId | string
  method: 'credit_card' | 'paypal'
  amount: number
  currency: string
  status: PaymentStatus
  transactionId: string
}

interface CreditCardPayment extends BasePayment {
  cardNumber: number
  firstName: string
  lastName: string
  expiration: string
  cvv: string
}

interface PaypalPayment extends BasePayment {
  payerEmail?: string
}

export interface PaymentResponse {
  paymentId: string
  orderId: string
  method: 'credit_card' | 'paypal'
  amount: number
  status: PaymentStatus
  currency: string
  transactionId: string
  createdAt: Date
}

export type IPayment = CreditCardPayment | PaypalPayment
