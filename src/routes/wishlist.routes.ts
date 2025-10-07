import { Router } from 'express'
import { WishlistController } from 'src/controller/wishlist.controller.js'
import { authWithRefreshMiddleware } from 'src/middleware/authToken.middleware.js'
import { checkIsActive } from 'src/middleware/checkIsActive.middleware.js'
import { roleUserMiddleware } from 'src/middleware/userRole.middleware.js'
import { WishlistRepository } from 'src/repository/wishlist.repository.js'
import { WishlistService } from 'src/service/wishlist.service.js'

const wishlistRoute = Router()
const controller = new WishlistController(new WishlistService(new WishlistRepository))

// Role @User
wishlistRoute.get('/', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.getProducts)
wishlistRoute.post('/:productId', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.addProduct)
wishlistRoute.delete('/:productId', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.deleteProductToWishlist)
export default wishlistRoute
