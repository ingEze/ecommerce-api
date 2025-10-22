import { Request, Response, NextFunction } from 'express'
import { WishlistService } from '../service/wishlist.service.js'
import { getCurrentUserById } from '../utils/getCurrentUserID.js'

export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  addProduct = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getCurrentUserById(req)
      const { productId } = req.params

      const data = {
        userId,
        productId
      }

      const response = await this.wishlistService.addProduct(data)
      const products = await Promise.all(
        response.products.map(p => ({
          productId: p.productId.toString()
        }))
      )

      const responseDto = {
        userId: response.userId,
        products
      }

      res.status(200).json({
        success: true,
        message: 'Product added to wishlist successfully',
        data: responseDto
      })
    } catch (err) {
      next(err)
    }
  }

  getProducts = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getCurrentUserById(req)

      const products = await this.wishlistService.getProductToWishlist(userId)

      res.status(200).json({
        success: true,
        products: products
      })
    } catch (err) {
      next(err)
    }
  }

  deleteProductToWishlist = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = getCurrentUserById(req)
      const { productId } = req.params

      await this.wishlistService.deleteProductToWishlist(userId, productId)

      res.status(200).json({
        success: true,
        message: 'Product removed successfully'
      })
    } catch (err) {
      next(err)
    }
  }
}
