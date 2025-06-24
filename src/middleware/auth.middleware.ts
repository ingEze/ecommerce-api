import { InvalidTokenError, UnauthorizedError } from '@ingeze/api-error'
import { Request, Response, NextFunction } from 'express'
import { verifyAuthToken, verifyRefreshToken } from 'src/utils/jwt.js'

export const refreshTokenMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { refresh_token } = req.cookies
    if (!refresh_token) {
      throw new UnauthorizedError({ reason: 'Token invalid or exipered' })
    }

    const decoded = verifyRefreshToken(refresh_token) as { id: string }
    if (typeof decoded === 'string' || !decoded.id) {
      throw new InvalidTokenError({ reason: 'Invalid token format' })
    }

    req.user = decoded

    next()
  } catch (err) {
    next(err)
  }
}

export const accessTokenMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { access_token } = req.cookies
    console.log(access_token)
    if (!access_token) {
      throw new UnauthorizedError({ reason: 'Token invalid or expired' })
    }

    const decoded = verifyAuthToken(access_token) as { id: string }
    console.log('decoded', decoded)
    console.log('typeof decoded', typeof decoded)
    if (typeof decoded !== 'object' || !decoded.id) {
      throw new InvalidTokenError({ reason: 'Invalid token format' })
    }

    req.user = decoded

    next()
  } catch (err) {
    next(err)
  }
}
