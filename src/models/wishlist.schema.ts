
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
    transform: (doc, ret): void => {
      ret.userId = ret._id.toString()

      delete ret._id
      delete ret.updatedAt
      delete ret.createdAt
    }
  }
})

export const Wishlist = model('Wishlist', wishlistSchema)
