import { Router } from 'express'
import { AuthController } from 'src/controller/auth.controller.js'
import { accessTokenMiddleware, refreshTokenMiddleware } from 'src/middleware/auth.middleware.js'
import { AuthService } from 'src/service/auth.service.js'

const authRoute = Router()

const controller = new AuthController(new AuthService())

authRoute.post('/register', controller.register)
authRoute.post('/login', controller.login)

authRoute.post('/refresh-token', refreshTokenMiddleware, controller.refreshToken)
authRoute.post('/test', accessTokenMiddleware)
export default authRoute
