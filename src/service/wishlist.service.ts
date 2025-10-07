import { NotFoundError } from '@ingeze/api-error'
import { IWishlist, IWishlistPopulated } from 'src/types/wishlist.types.js'
import { ProductRepository } from 'src/repository/products.repository.js'
import { WishlistRepository } from 'src/repository/wishlist.repository.js'
import { IWishlistProductInput } from 'src/types/wishlist.types.js'

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
    await this.wishlistRepository.deleteProductToWishlist(userId, wishlistProductId)
  }
}
