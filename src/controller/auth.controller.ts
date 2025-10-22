import { BadRequestError, UnauthorizedError } from '@ingeze/api-error'
import { Request, Response, NextFunction } from 'express'
import { ValidateLogin, registerValidationData, ValidateResetPassword, ValidateEmail } from '../dtos/auth.dto.js'
import { AuthService } from '../service/auth.service.js'
import { checkRequiredFields } from '../utils/dataEmptyError.js'
import { generateAuthToken } from '../utils/jwt.js'

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  registerAndSendValidateMail = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = registerValidationData(req.body)

      checkRequiredFields(data)
      const emailCode = await this.authService.register(data)

      res.status(201).json({
        success: true,
        message: 'A verification email has been sent',
        emailCode: emailCode
      })
    } catch (err) {
      next(err)
    }
  }

  login = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = ValidateLogin(req.body)
      checkRequiredFields(data)

      const token = await this.authService.login(data)
      const CONFIG_COOKIE = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const
      }

      res
        .cookie('refresh_token', token.refresh_token, {
          ...CONFIG_COOKIE,
          maxAge: 7 * 24 * 60 * 60 * 1000
        })
        .cookie('access_token', token.access_token, {
          ...CONFIG_COOKIE,
          maxAge: 15 * 60 * 1000
        })
        .status(200).json({
          success: true,
          message: 'Login successfully'
        })
    } catch (err) {
      next(err)
    }
  }

  requestPasswordReset = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = ValidateEmail(req.body)
      if (!data) {
        throw new BadRequestError({ reason: 'Invalid email data provided' })
      }

      checkRequiredFields(data)

      await this.authService.requestPasswordReset(data)

      res.status(200).json({
        success: true,
        message: 'Password reset code sent to your email'
      })

    } catch (err) {
      next(err)
    }
  }

  resetPassword = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.params

      const validateData = ValidateResetPassword(req.body)
      if (!validateData) {
        throw new BadRequestError({ reason: 'Invalid password reset data provided' })
      }

      const data = {
        token: token,
        password: validateData.password
      }

      await this.authService.resetPassword(data)

      res.status(200).json({
        success: true,
        message: 'Password updated successfully'
      })
    } catch (err) {
      next(err)
    }
  }

  refreshToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const user = req.user
      if (!user || typeof user !== 'object' || !('_id' in user)) {
        throw new UnauthorizedError({ reason: 'Invalid user payload' })
      }

      const accessToken = generateAuthToken({ _id: user._id })
      res
        .cookie('access_token', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict' as const,
          maxAge: 15 * 60 * 1000
        })
        .status(200).json({
          success: true,
          message: 'Access token refreshed'
        })
    } catch (err) {
      next(err)
    }
  }

  authMiddleware = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError({ reason: 'User unauthorized' })
      }

      const result = await this.authService.authMiddleware(req.user._id)

      res.status(200).json({
        success: true,
        data: result
      })
    } catch (err) {
      next(err)
    }
  }
}
