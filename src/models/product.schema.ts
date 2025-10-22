import mongoose from 'mongoose'
import { IProductSchema } from '../types/product.types.js'

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
  isActive: {
    type: Boolean,
    default: true,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deletedAt: Date
},{ timestamps: true , toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

ProductSchema.virtual('inStock').get(function() {
  return this.quantity > 0
})

export const Products = mongoose.model('Products', ProductSchema)
