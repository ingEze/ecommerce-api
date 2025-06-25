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
  owner: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  }
},{ timestamps: true })

export const Product = mongoose.model('Product', ProductSchema)
