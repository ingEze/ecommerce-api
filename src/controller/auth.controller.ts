import { UnauthorizedError } from '@ingeze/api-error'
import { Request, Response, NextFunction } from 'express'
import { AuthService } from 'src/service/auth.service.js'
import { checkRequiredFields } from 'src/utils/dataEmptyError.js'
import { generateAuthToken } from 'src/utils/jwt.js'

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body
      checkRequiredFields(email, password)
      await this.authService.register({ email, password })

      res.status(201).json({
        success: true,
        messahe: 'User created'
      })
    } catch (err) {
      next(err)
    }
  }

  login = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body
      checkRequiredFields(email, password)

      const token = await this.authService.login({ email, password })

      const CONFIG_COOKIE = {
        httpOnly: true,
        secure: true,
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
          secure: true,
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
}
