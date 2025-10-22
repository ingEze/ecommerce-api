import { Schema, Types, model } from 'mongoose'
import { PaymentResponse } from '../types/payment.types.js'

const ProcessPaymentSchema = new Schema({
  orderId: {
    type: Types.ObjectId,
    ref: 'Orders',
    required: true
  },
  method: {
    type: String,
    enum: ['credit_card', 'paypal'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'complete', 'cancelled'],
    default: 'pending'
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  transactionId: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (doc, ret): Record<string, PaymentResponse> => {
      ret.paymentId = ret._id.toString()
      delete ret._id
      delete ret.updatedAt
      return ret
    }
  }
})

export const ProcessPayment = model('ProcessPayment', ProcessPaymentSchema)
