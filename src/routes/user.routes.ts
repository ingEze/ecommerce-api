import { Router } from 'express'
import { UserController } from '../controller/user.controller.js'
import { authWithRefreshMiddleware, checkIsActive, roleUserMiddleware } from '../middleware/index.js'
import { UserRepository } from '../repository/user.repository.js'
import { UserService } from '../service/user.service.js'
import { checkDemoUser } from '../middleware/checkDemoUser.middleware.js'

const userRoute = Router()
const controller = new UserController(new UserService(new UserRepository()))

/**
 * @swagger
 * tags:
 *   name: "Users"
 *   description: Endpoints for user account management
 */

// Role @Guest

/**
 * @swagger
 * /user/{username}:
 *   get:
 *     summary: Get all products by username
 *     description: Retrieve a paginated list of products for a given user.
 *     tags: ["Users"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *       404:
 *         description: User not found
 */
userRoute.get('/:username', authWithRefreshMiddleware, controller.getAllProducts)

/**
 * @swagger
 * /user/verify/{token}:
 *   patch:
 *     summary: Activate user account
 *     description: Activate a user account using a verification token.
 *     tags: ["Users"]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token
 *     responses:
 *       200:
 *         description: Mail validated successfully
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
 *                   example: Mail validated successfully
 *       400:
 *         description: Invalid or missing token
 */
userRoute.patch('/verify/:token', checkDemoUser, controller.activateAccount)

// Role @User

/**
 * @swagger
 * /user/me/username:
 *   patch:
 *     summary: Update username
 *     description: Update the username of the authenticated user.
 *     tags: ["Users"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newUsername
 *               - password
 *             properties:
 *               newUsername:
 *                 type: string
 *                 example: "newuser123"
 *               password:
 *                 type: string
 *                 example: "currentPassword"
 *     responses:
 *       200:
 *         description: Username updated successfully
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
 *                   example: Username updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: "newuser123"
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 */
userRoute.patch('/me/username', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, checkDemoUser, controller.updateUsername)

/**
 * @swagger
 * /user/me/password:
 *   patch:
 *     summary: Update password
 *     description: Update the password of the authenticated user.
 *     tags: ["Users"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *               - password
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: "newPassword123"
 *               password:
 *                 type: string
 *                 example: "currentPassword"
 *     responses:
 *       200:
 *         description: Password updated successfully
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
 *                   example: Password updated successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 */
userRoute.patch('/me/password', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, checkDemoUser, controller.updatePassword)

/**
 * @swagger
 * /user/me/email:
 *   patch:
 *     summary: Update email
 *     description: Update the email of the authenticated user.
 *     tags: ["Users"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newEmail
 *               - password
 *             properties:
 *               newEmail:
 *                 type: string
 *                 format: email
 *                 example: "newemail@example.com"
 *               password:
 *                 type: string
 *                 example: "currentPassword"
 *     responses:
 *       200:
 *         description: Email updated successfully
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
 *                   example: Email updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "newemail@example.com"
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 */
userRoute.patch('/me/email', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, checkDemoUser, controller.updateEmail)

/**
 * @swagger
 * /user/me/status:
 *   patch:
 *     summary: Update account status
 *     description: Activate or deactivate the authenticated user's account.
 *     tags: ["Users"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *               - password
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               password:
 *                 type: string
 *                 example: "currentPassword"
 *     responses:
 *       200:
 *         description: Account status updated
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
 *                   example: Account activated
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 */
userRoute.patch('/me/status', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, checkDemoUser, controller.updateStatusAccount)

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

export default userRoute
