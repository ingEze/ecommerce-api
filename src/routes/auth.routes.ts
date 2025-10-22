import { Router } from 'express'
import { AuthController } from '../controller/auth.controller.js'
import { authWithRefreshMiddleware, refreshTokenMiddleware } from '../middleware/index.js'
import { authRateLimiter, forgotPasswordRateLimiter } from '../middleware/rateLimit.middleware.js'
import { AuthService } from '../service/auth.service.js'

const authRoute = Router()
const controller = new AuthController(new AuthService())

/**
 * @swagger
 * tags:
 *   name: "Auth"
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user and send verification email
 *     tags: ["Auth"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               username:
 *                 type: string
 *                 example: "user123"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *               role:
 *                 type: string
 *                 enum: [User]
 *                 example: "User"
 *             required:
 *               - email
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: User registered and verification email sent
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
 *                   example: "User registered. Please check your email to verify your account."
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 */
authRoute.post('/register', authRateLimiter, controller.registerAndSendValidateMail)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: ["Auth"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successful login, sets access_token and refresh_token cookies
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
 *                   example: "Login successful"
 *         headers:
 *           Set-Cookie:
 *             description: Authentication cookies
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 */
authRoute.post('/login', authRateLimiter, controller.login)

/**
 * @swagger
 * /auth/forgot-password:
 *   patch:
 *     summary: Request password reset
 *     tags: ["Auth"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Password reset email sent
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
 *                   example: "Password reset email sent"
 *       400:
 *         description: Invalid email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid email"
 */
authRoute.patch('/forgot-password', forgotPasswordRateLimiter, controller.requestPasswordReset)

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   patch:
 *     summary: Reset password using token
 *     tags: ["Auth"]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: "NewPassword123!"
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Password reset successfully
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
 *                   example: "Password reset successfully"
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired token"
 */
authRoute.patch('/reset-password/:token', forgotPasswordRateLimiter, controller.resetPassword)

authRoute.get('/me', authWithRefreshMiddleware, controller.authMiddleware)

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh JWT access token
 *     tags: ["Auth"]
 *     responses:
 *       200:
 *         description: New access_token set in cookie
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
 *                   example: "Token refreshed"
 *         headers:
 *           Set-Cookie:
 *             description: Cookie with new access_token
 *       401:
 *         description: Invalid token or unauthorized user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid token or unauthorized user"
 */
authRoute.post('/refresh', refreshTokenMiddleware, forgotPasswordRateLimiter, controller.refreshToken)

export default authRoute
