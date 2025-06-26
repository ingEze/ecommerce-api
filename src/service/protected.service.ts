import { BadRequestError, ForbiddenUserError, NotFoundError, UnauthorizedError } from '@ingeze/api-error'
import { ProductRepository } from 'src/repository/products.repository.js'
import { UserRepository } from 'src/repository/user.repository.js'
import { IGetAllProducts, ProductDto } from 'src/types/product.types.js'

export class ProductsService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getAllProducts(page: number = 1, limit: number = 20): Promise<IGetAllProducts> {
    const totalProducts = await this.productRepository.getMountProducts()
    if (totalProducts === 0) {
      throw new NotFoundError({
        reason: 'No products found in the database.'
      })
    } else if (!totalProducts) {
      throw new BadRequestError({
        reason: 'Failed to retrieve the total number of products.'
      })
    }

    const maxPage = Math.ceil(totalProducts / limit)

    const products = await this.productRepository.getAllProducts(page, limit)
    console.log('PRODUCTS SERVICE:', products)
    if (!products || products.length === 0) {
      throw new BadRequestError({
        reason: 'No products found for the requested page.'
      })
    }

    return {
      limit,
      maxPage,
      totalProducts,
      products
    }
  }

  async createProduct(userId: string, data: ProductDto): Promise<ProductDto> {
    const user = await new UserRepository().findUserById(userId)
    if (!user) throw new UnauthorizedError()

    if (!user.role.includes('Seller')) {
      throw new ForbiddenUserError({ reason: 'Access restricted to "Seller" role' })
    }

    const result = await this.productRepository.createOrUpdateProducts(userId, data)
    const responseSanitized = {
      title: result.title,
      price: result.price,
      description: result.description,
      quantity: result.quantity
    }
    return responseSanitized
  }
}
