import { Types, Document, Schema } from 'mongoose'

export interface IProductSchema extends Document {
  _id: Types.ObjectId
  title: string
  price: number
  description: string
  quantity: number
  owner: Schema.Types.ObjectId
}

export interface ProductDto {
  title: string
  price: number
  description: string
  quantity?: number
}

export interface ProductUpdateDto {
  title?: string
  price?: number
  description?: string
  quantity?: number
}

export interface IGetAllProducts {
  page: number
  limit: number
  totalPage: number
  totalProducts: number
  products: IProductSchema[]
}
