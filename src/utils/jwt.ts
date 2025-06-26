import { InvalidTokenError } from '@ingeze/api-error'
import jwt from 'jsonwebtoken'
import { config } from 'src/config/index.js'

const AUTH_SECRET = config.jwt.AUTH_TOKEN_SECRET ?? 'secret'
const REFRESH_SECRET = config.jwt.AUTH_REFRESh_SECRET ?? 'secret123'

export const generateAuthToken = (data: { _id: string }): string => {
  return jwt.sign(
    {
      _id: data._id
    },
    AUTH_SECRET,
    {
      expiresIn: '15m'
    }
  )
}

export const verifyAuthToken = (token: string): string | jwt.JwtPayload => {
  const decoded = jwt.verify(token, AUTH_SECRET)
  if (!decoded) throw new InvalidTokenError({ reason: 'Token invalid or expires' })
  return decoded
}

export const generateRefreshToken = (data: { _id: string }): string => {
  return jwt.sign(
    {
      _id: data._id
    },
    REFRESH_SECRET,
    {
      expiresIn: '7d'
    }
  )
}

export const verifyRefreshToken = (token: string): string | jwt.JwtPayload => {
  const decoded = jwt.verify(token, REFRESH_SECRET)
  if (!decoded) throw new InvalidTokenError({ reason: 'Token invalid or expires' })
  return decoded
}
