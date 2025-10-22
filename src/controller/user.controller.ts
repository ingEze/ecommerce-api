import { BadRequestError } from '@ingeze/api-error'
import { Request, Response, NextFunction } from 'express'
import { validatePaginationParams } from '../dtos/pagination.dto.js'
import { validateUpdateEmail, validateUpdatePassword, validateUpdateStatusAccount, validateUpdateUsername } from '../dtos/userParams.dto.js'
import { UserService } from '../service/user.service.js'
import { getCurrentUserById } from '../utils/getCurrentUserID.js'

export class UserController {
  constructor(private readonly userService: UserService) {}

  activateAccount = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.params
      if (!token) throw new BadRequestError({ reason: 'Token not provided' })

      await this.userService.activeAccount(token)

      res.status(200).json({
        success: true,
        message: 'Mail validated successfully'
      })
    } catch (err) {
      next(err)
    }
  }

  getAllProducts = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20

      const { username } = req.params

      validatePaginationParams(page || 1, limit || 20)

      const result = await this.userService.getProductsByUser(page, limit, username)

      const { products, ...pagination } = result

      res.status(200).json({
        success: true,
        message: 'Products retrieved successfully',
        pagination: pagination,
        data: {
          products
        }
      })
    } catch (err) {
      next(err)
    }
  }

  updateUsername = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validateUsername = validateUpdateUsername(req.body)
      if (!validateUpdateUsername) throw new BadRequestError({ reason: validateUsername })

      const userId = getCurrentUserById(req)

      const data = {
        username: validateUsername.username,
        password: validateUsername.password
      }

      const result = await this.userService.updateUsername(data, userId)

      res.status(200).json({
        success: true,
        message: 'Username updated successfully',
        data: {
          username: result.username
        }
      })
    } catch (err) {
      next(err)
    }
  }

  updatePassword = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validatePassword = validateUpdatePassword(req.body)
      if (!validatePassword) throw new BadRequestError({ reason: validatePassword })
      const userId = getCurrentUserById(req)

      const data = {
        password: validatePassword.password,
        currentPassword: validatePassword.currentPassword
      }

      await this.userService.updatePassword(data, userId)

      res.status(200).json({
        success: true,
        message: 'Password updated successfully'
      })
    } catch (err) {
      next(err)
    }
  }

  updateEmail = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validateEmail = validateUpdateEmail(req.body)
      if (!validateEmail) throw new BadRequestError({ reason: validateEmail })

      const userId = getCurrentUserById(req)

      const data = {
        email: validateEmail.email,
        password: validateEmail.password
      }

      const result = await this.userService.updateEmail(data, userId)

      res.status(200).json({
        success: true,
        message: 'Email updated successfully',
        data: {
          email: result.email
        }
      })
    } catch (err) {
      next(err)
    }
  }

  updateStatusAccount = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validateStatusAccount = validateUpdateStatusAccount(req.body)
      if (!validateStatusAccount) throw new BadRequestError({ reason: validateStatusAccount })

      const userId = getCurrentUserById(req)

      const data = {
        isActive: validateStatusAccount.isActive,
        password: validateStatusAccount.password
      }

      await this.userService.updateStatusAccount(data, userId)

      const msg = validateStatusAccount.isActive
        ? 'Account activated'
        : 'Account disabled'

      res.status(200).json({
        success: true,
        message: msg
      })
    } catch (err) {
      next(err)
    }
  }
}
