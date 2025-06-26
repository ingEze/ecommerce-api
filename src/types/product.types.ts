import { Schema } from 'mongoose'

export interface IProductSchema {
  title: string
  price: number
  description: string
  quantity: number
  owner: Schema.Types.ObjectId
}

export interface ProductDto {
  title: string
  price: number
  description: string,
  quantity?: number
}

export interface IGetAllProducts {
  limit: number
  maxPage: number
  totalProducts: number
  products: IProductSchema[]
}
