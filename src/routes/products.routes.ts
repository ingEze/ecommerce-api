import { Router } from 'express'
import { authWithRefreshMiddleware, checkIsActive, roleUserMiddleware } from '../middleware/index.js'
import { ProtectedController } from '../controller/products.controller.js'
import { ProductsService } from '../service/products.service.js'
import { ProductRepository } from '../repository/products.repository.js'

const controller = new ProtectedController(new ProductsService(new ProductRepository))

const productsRoute = Router()

/**
 * @swagger
 * tags:
 *   name: "Products"
 *   description: Endpoints for managing products
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a paginated list of products. Supports filters by user, search, price, and sort.
 *     tags: ["Products"]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Username to filter products by owner
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product title
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price (or 'free')
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc]
 *         description: Sort by price ascending or descending
 *     responses:
 *       200:
 *         description: Products retrieved successfully
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
 *                   example: Products retrieved successfully
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     totalPage:
 *                       type: integer
 *                       example: 5
 *                     totalProducts:
 *                       type: integer
 *                       example: 100
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid query parameters
 */
productsRoute.get('/products', controller.getAllProducts)

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve a single product by its ID.
 *     tags: ["Products"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
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
 *                   example: Products
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid product ID format
 */
productsRoute.get('/products/:id', controller.getProductById)

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Add a new product. Requires authentication.
 *     tags: ["Products"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully
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
 *                   example: Product created successfully
 *                 product:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid product data
 *       401:
 *         description: Unauthorized
 */
productsRoute.post('/products', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.addProduct)

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update a product
 *     description: Update an existing product. Requires authentication.
 *     tags: ["Products"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdateInput'
 *     responses:
 *       200:
 *         description: Product updated successfully
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
 *                   example: Product updated successfully
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid update data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */

productsRoute.patch('/products/:id', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.updateProduct)

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Delete a product by ID. Requires authentication.
 *     tags: ["Products"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product removed successfully
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
 *                   example: Product removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 */
productsRoute.delete('/products/:id', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.deletedProduct)

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: \"Wireless Mouse\"
 *         price:
 *           type: number
 *           example: 39.99
 *         description:
 *           type: string
 *           example: \"A high-precision wireless mouse.\"
 *         quantity:
 *           type: integer
 *           example: 10
 *         isActive:
 *           type: boolean
 *           example: true
 *         owner:
 *           type: string
 *           example: \"user123\"
 *     ProductInput:
 *       type: object
 *       required:
 *         - title
 *         - price
 *         - description
 *         - quantity
 *       properties:
 *         title:
 *           type: string
 *           example: \"Wireless Mouse\"
 *         price:
 *           type: number
 *           example: 39.99
 *         description:
 *           type: string
 *           example: \"A high-precision wireless mouse.\"
 *         quantity:
 *           type: integer
 *           example: 10
 *     ProductUpdateInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: \"Wireless Mouse\"
 *         price:
 *           type: number
 *           example: 39.99
 *         description:
 *           type: string
 *           example: \"A high-precision wireless mouse.\"
 *         quantity:
 *           type: integer
 *           example: 10
 */
export default productsRoute
