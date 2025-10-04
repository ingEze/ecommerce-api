import { Router } from 'express'
import { AuthController } from 'src/controller/auth.controller.js'
import { UserController } from 'src/controller/user.controller.js'
import { authWithRefreshMiddleware, checkIsActive, roleUserMiddleware } from 'src/middleware/index.js'
import { UserRepository } from 'src/repository/user.repository.js'
import { AuthService } from 'src/service/auth.service.js'
import { UserService } from 'src/service/user.service.js'

const userRoute = Router()
const controller = new UserController(new UserService(new UserRepository()))
const controllerAuth = new AuthController(new AuthService())

// Role @Guest
userRoute.get('/:username', authWithRefreshMiddleware, controller.getAllProducts)

userRoute.patch('/verify/:token', controllerAuth.activateAccount)

// Role @User
userRoute.patch('/me/username', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.updateUsername)
userRoute.patch('/me/password', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.updatePassword)
userRoute.patch('/me/status', authWithRefreshMiddleware, checkIsActive, roleUserMiddleware, controller.updateStatusAccount)

export default userRoute
