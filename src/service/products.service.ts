import { BadRequestError, UserNotFoundError } from '@ingeze/api-error'
import { ProductRepository } from '../repository/products.repository.js'
import { IGetAllProducts, IProductsService, ProductDto, ProductUpdateDto } from '../types/product.types.js'
import { formatProducts } from '../utils/formatProduct.js'
import { UserRepository } from '../repository/user.repository.js'

const userRepository = new UserRepository
export class ProductsService implements IProductsService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getAllProducts(
    page: number = 1,
    limit: number = 20,
    data: {
      username?: string,
      search?: string,
      minPrice?: number | string,
      maxPrice?: number,
      sort?: 'price_asc' | 'price_desc'
    }): Promise<IGetAllProducts> {
    const filter: Record<string, string | number> = {}

    if (data.username) {
      const user = await userRepository.findUserByUsername(data.username)
      if (!user) throw new UserNotFoundError()
      filter.owner = user._id
    }

    if (data.minPrice) {
      filter.minPrice = data.minPrice
    }

    if (data.search) {
      filter.title = data.search
    }

    if (data.sort) {
      filter.sort = data.sort
    }

    const totalProducts = await this.productRepository.getMountProducts(filter)
    const totalPage = Math.ceil(totalProducts / limit)
    const products = await this.productRepository.getAllProducts(page, limit, filter)
    if (!products) {
      throw new BadRequestError({
        reason: 'No products found for the requested page'
      })
    }
    const formated = await Promise.all(products.map(async(product) => await formatProducts(product)))

    return {
      page,
      limit,
      totalPage,
      totalProducts,
      products: formated
    }
  }

  async getProductById(productId: string): Promise<ProductDto> {
    if (productId.length !== 24) {
      throw new BadRequestError({
        reason: 'Invalid product ID format'
      })
    }
    const product = await this.productRepository.getProductById(productId)
    const user = await this.productRepository.getUserById(product.owner)
    const productSanitized = {
      title: product.title,
      price: product.price,
      description: product.description,
      quantity: product.quantity,
      owner: user
    }
    return productSanitized
  }

  async createProduct(userId: string, data: ProductDto): Promise<ProductDto> {
    const result = await this.productRepository.createProducts(userId, data)
    const resultSanitized = await formatProducts(result)
    return resultSanitized
  }

  async updateProduct(userId: string, productId: string, data: ProductUpdateDto): Promise<void> {
    await this.productRepository.updateProducts(userId, productId, data)
  }

  async deleteProduct(userId: string, productId: string): Promise<void> {
    await this.productRepository.deleteProduct(userId, productId)
  }
}
