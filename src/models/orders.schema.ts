/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose'

interface IOrder {
  userId: mongoose.Schema.Types.ObjectId
  items: {
    productId: string
    title: string
    price: number
    quantity: number
  }[]
  total: number
  totalWithWax: number
  status: 'pending' | 'paid' | 'shipped' | 'complete' | 'cancelled'
  shippingAddress: {
    street: string
    city: string
    zip: string
  }
  paymentMethod: string
}

const OrderSchema = new mongoose.Schema<IOrder>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        ref: 'Products',
        required: true
      },
      title: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      owner: {
        type: mongoose.Types.ObjectId,
        ref: 'Users',
        required: true
      }
    }
  ],
  total: {
    type: Number,
    required: true
  },
  totalWithWax: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'complete', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    zip: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (doc, ret): Record<string, any> => {
      ret.orderId = ret._id.toString()
      delete ret._id
      delete ret.updatedAt

      if (ret.items) {
        ret.items = ret.items.map((item: any) => {
          delete item._id
          return item
        })
      }
      return ret
    }
  }
})

export const Orders = mongoose.model('Orders', OrderSchema)
