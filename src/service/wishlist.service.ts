import { NotFoundError } from '@ingeze/api-error'
import { IWishlist, IWishlistPopulated } from '../types/wishlist.types.js'
import { ProductRepository } from '../repository/products.repository.js'
import { WishlistRepository } from '../repository/wishlist.repository.js'
import { IWishlistProductInput } from '../types/wishlist.types.js'

export class WishlistService {
  constructor(private readonly wishlistRepository: WishlistRepository) {}

  async addProduct(data: IWishlistProductInput): Promise<IWishlist> {
    const productRepository = new ProductRepository()
    const product = productRepository.getProductById(data.productId)
    if (!product) {
      throw new NotFoundError({ reason: 'Product not found' })
    }

    const response = await this.wishlistRepository.addProduct(data)
    return response
  }

  async getProductToWishlist(userId: string): Promise<IWishlistPopulated> {
    return await this.wishlistRepository.getProducts(userId)
  }

  async deleteProductToWishlist(userId: string, wishlistProductId: string): Promise<void> {
    const result = await this.wishlistRepository.deleteProductToWishlist(userId, wishlistProductId)
    if (result.modifiedCount === 0) {
      throw new NotFoundError({ reason: 'Product not found in wishlist' })
    }
  }
}
