import { BadRequestError } from '@ingeze/api-error'
import { UpdateWriteOpResult } from 'mongoose'
import { Wishlist } from '../models/wishlist.schema.js'
import { IWishlist, IWishlistProductInput, IWishlistPopulated } from '../types/wishlist.types.js'

export class WishlistRepository {
  async addProduct(data: IWishlistProductInput): Promise<IWishlist> {

    const alreadyInWishlist = await Wishlist.findOne({
      userId: data.userId,
      'products.productId': data.productId
    })
    if (alreadyInWishlist) {
      throw new BadRequestError({ reason: 'Product already added in wishlist' })
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: data.userId },
      { $addToSet: { products: { productId: data.productId } } },
      { new: true, upsert: true }
    ).lean<IWishlist>()

    return wishlist
  }

  async getProducts(userId: string): Promise<IWishlistPopulated> {
    const wishlist = await Wishlist.findOne({ userId })
      .populate('products.productId', '_id title price')
      .exec()

    if (!wishlist || !wishlist.userId) {
      throw new BadRequestError({ reason: 'Not found products in your wishlist' })
    }

    if (!wishlist.userId) throw new BadRequestError()

    const response = {
      userId: wishlist.userId.toString(),
      products: wishlist.products.map(p => ({
        productId: p.productId._id.toString(),
        title: p.productId.title,
        price: p.productId.price
      }))
    }

    return response
  }

  async deleteProductToWishlist(userId: string, wishlistProductId: string): Promise<UpdateWriteOpResult> {
    return await Wishlist.updateOne(
      { userId },
      { $pull: { products: { productId: wishlistProductId } } }
    )
  }
}
