import { Router } from 'express'
import { WishlistController } from '../controller/wishlist.controller.js'
import { authWithRefreshMiddleware } from '../middleware/authToken.middleware.js'
import { checkIsActive } from '../middleware/checkIsActive.middleware.js'
import { roleUserMiddleware } from '../middleware/userRole.middleware.js'
import { WishlistRepository } from '../repository/wishlist.repository.js'
import { WishlistService } from '../service/wishlist.service.js'

const wishlistRoute = Router()
const controller = new WishlistController(new WishlistService(new WishlistRepository))

/**
 * @swagger
 * tags:
 *   name: "Wishlist"
 *   description: Endpoints for managing user wishlists
 */

// Role @User

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Get user's wishlist
 *     description: Retrieve all products in the authenticated user's wishlist.
 *     tags: ["Wishlist"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Wishlist retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 */
wishlistRoute.get('/', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.getProducts)

/**
 * @swagger
 * /wishlist:
 *   post:
 *     summary: Add product to wishlist
 *     description: Add a product to the authenticated user's wishlist.
 *     tags: ["Wishlist"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "60f7c0b8b4d1c80015e4d123"
 *     responses:
 *       201:
 *         description: Product added to wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product added to wishlist
 *       400:
 *         description: Invalid product ID
 *       401:
 *         description: Unauthorized
 */
wishlistRoute.post('/:productId', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.addProduct)

/**
 * @swagger
 * /wishlist/{productId}:
 *   delete:
 *     summary: Remove product from wishlist
 *     description: Remove a product from the authenticated user's wishlist.
 *     tags: ["Wishlist"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to remove from wishlist
 *     responses:
 *       200:
 *         description: Product removed from wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Product removed from wishlist
 *       400:
 *         description: Invalid product ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found in wishlist
 */
wishlistRoute.delete('/:productId', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.deleteProductToWishlist)

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Wireless Mouse"
 *         price:
 *           type: number
 *           example: 39.99
 *         description:
 *           type: string
 *           example: "A high-precision wireless mouse."
 *         quantity:
 *           type: integer
 *           example: 10
 *         isActive:
 *           type: boolean
 *           example: true
 *         owner:
 *           type: string
 *           example: "user123"
 */
export default wishlistRoute
