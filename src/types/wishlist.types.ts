import { Types } from 'mongoose'

export interface IWishlistProductInput {
    userId: string
    productId: string
}

export interface IWishlist {
  userId: Types.ObjectId | string
  products: {
    productId: Types.ObjectId | string
  }[]
}

export interface IWishlistPopulated {
  userId: Types.ObjectId | string
  products: {
    productId: {
      _id: Types.ObjectId
      title: string
      price: number
    }
  }[]
}
