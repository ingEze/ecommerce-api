import { InvalidTokenError } from '@ingeze/api-error'
import jwt from 'jsonwebtoken'
import { config } from 'src/config/index.js'

const AUTH_SECRET = config.jwt.AUTH_TOKEN_SECRET ?? 'secret'

export const generateAuthToken = (data: { _id: string, email: string }): string => {
  return jwt.sign(
    {
      _id: data._id,
      email: data.email
    },
    AUTH_SECRET,
    {
      expiresIn: '15m'
    }
  )
}

export const verifyAuthToken = (token: string): string | jwt.JwtPayload => {
  const decoded = jwt.verify(token, AUTH_SECRET)
  if (!decoded) throw new InvalidTokenError()
  return decoded
}
