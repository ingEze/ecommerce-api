import { Schema } from 'mongoose'

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'complete' | 'cancelled' | 'failed'

interface IOrderItem {
  productId: string
  title: string
  price: number
  quantity: number
  owner?: string
}

export interface IOrder {
  userId: Schema.Types.ObjectId | string
  items: IOrderItem[]
  total: number
  totalWithWax: number
  status: OrderStatus
  shippingAddress: {
    street: string
    city: string
    zip: string
  }
}
