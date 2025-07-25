import { InvalidTokenError, UnauthorizedError } from '@ingeze/api-error'
import { Request, Response, NextFunction } from 'express'
import { generateAuthToken, verifyAuthToken, verifyRefreshToken } from 'src/utils/jwt.js'

export const refreshTokenMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { refresh_token } = req.cookies
    if (!refresh_token) {
      throw new UnauthorizedError({ reason: 'Token invalid or exipered' })
    }

    const decoded = verifyRefreshToken(refresh_token) as { _id: string }
    console.log('DECODED REFRESH TOKEN MIDDLEWARE:', decoded)

    if (typeof decoded === 'string' || !decoded._id) {
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
    if (!access_token) {
      throw new UnauthorizedError({ reason: 'Token invalid or expired' })
    }

    const decoded = verifyAuthToken(access_token) as { _id: string }
    console.log('DECODED ACCESS TOKEN MIDDLEWARE:', decoded)
    if (typeof decoded !== 'object' || !decoded._id) {
      throw new InvalidTokenError({ reason: 'Invalid token format' })
    }

    req.user = decoded

    next()
  } catch (err) {
    next(err)
  }
}

export const authWithRefreshMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { refresh_token, access_token } = req.cookies

    try {
      const decoded = verifyAuthToken(access_token) as { _id: string }
      if (!decoded) throw new InvalidTokenError({ reason: 'Invalid token format' })
      req.user = decoded

      return next()
    } catch {
      if (!refresh_token) throw new UnauthorizedError({ reason: 'Refresh token missing' })

      const decodedRefresh = verifyRefreshToken(refresh_token) as { _id:string }

      if (!decodedRefresh) throw new InvalidTokenError({ reason: 'Invalid token format' })

      const newAccessToken = generateAuthToken({ _id: decodedRefresh._id })

      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      })

      req.user = decodedRefresh

      return next()
    }
  } catch (err) {
    next(err)
  }
}
