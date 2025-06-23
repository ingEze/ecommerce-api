import { Router } from 'express'
import { AuthController } from 'src/controller/auth.controller.js'
import { AuthService } from 'src/service/auth.service.js'

const authRoute = Router()

const controller = new AuthController(new AuthService())

authRoute.post('/register', controller.register)
authRoute.post('/login', controller.login)

export default authRoute
