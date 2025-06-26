import mongoose, { Types } from 'mongoose'
import { IProductSchema } from 'src/types/product.types.js'

const ProductSchema = new mongoose.Schema<IProductSchema>({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  owner: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  }
},{ timestamps: true })

export const Products = mongoose.model('Products', ProductSchema)
