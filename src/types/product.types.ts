import { Types, Document, Schema } from 'mongoose'

export interface IProductsService {
  getAllProducts(
    page?: number,
    limit?: number,
    data?: {
      username?: string,
      title?: string,
      minPrice?: number | string,
      maxPrice?: number
    }
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
  isActive: boolean
  owner: Schema.Types.ObjectId
  deletedAt: Date
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

export interface IQueryDTO {
  username?: string
  search?: string
  minPrice?: number | string
  maxPrice?: number
  sort?: 'price_asc' | 'price_desc'
}
