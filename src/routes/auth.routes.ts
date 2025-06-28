import { Router } from 'express'
import { AuthController } from 'src/controller/auth.controller.js'
import { refreshTokenMiddleware } from 'src/middleware/index.js'
import { AuthService } from 'src/service/auth.service.js'

const authRoute = Router()

const controller = new AuthController(new AuthService())

authRoute.post('/register', controller.register)
authRoute.post('/login', controller.login)

authRoute.post('/reset-password', controller.resetPassword)

authRoute.post('/refresh-token', refreshTokenMiddleware, controller.refreshToken)
export default authRoute
