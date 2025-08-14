import { Types, Document, Schema } from 'mongoose'

export interface IProductsService {
  getAllProducts(
    page?: number,
    limit?: number,
    username?: string,
    title?: string
  ): Promise<IGetAllProducts>

  getProductById(productId: string): Promise<ProductDto>

  createProduct(userId: string, data: ProductDto): Promise<ProductDto>

  updateProduct(
    userId: string,
    productId: string,
    data: ProductUpdateDto
  ): Promise<void>

  deleteProduct(userId: string, productId: string): Promise<void>
}

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
