import { BadRequestError } from '@ingeze/api-error'
import { ProductRepository } from 'src/repository/products.repository.js'
import { IGetAllProducts, ProductDto, ProductUpdateDto } from 'src/types/product.types.js'
import { formatProducts } from 'src/utils/formatProduct.js'

export class ProductsService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getAllProducts(page: number = 1, limit: number = 20): Promise<IGetAllProducts> {
    const totalProducts = await this.productRepository.getMountProducts()
    const totalPage = Math.ceil(totalProducts / limit)
    const products = await this.productRepository.getAllProducts(page, limit)

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
    }}

  async createProduct(userId: string, data: ProductDto): Promise<ProductDto> {
    const result = await this.productRepository.createProducts(userId, data)
    const resultSanitized = await formatProducts(result)
    return resultSanitized
  }

  async updateProduct(userId: string, productId: string, data: ProductUpdateDto): Promise<void> {
    await this.productRepository.updateProducts(userId, productId, data)
  }
}
