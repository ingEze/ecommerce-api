/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, Types, model } from 'mongoose'

const wishlistSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'Users',
    required: true
  },
  products: [
    {
      productId: {
        type: Types.ObjectId,
        ref: 'Products',
        required: true
      }
    }
  ]
},
{ timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (doc, ret): Record<string, any> => {
      ret.userId = ret._id.toString()

      delete ret._id
      delete ret.updatedAt
      delete ret.createdAt

      if (ret.products) {
        ret.products = ret.products.map((p: any) => {
          delete p._id
          return p
        })
      }
      return ret
    }
  }
})

export const Wishlist = model('Wishlist', wishlistSchema)
