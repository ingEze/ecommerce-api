import { InvalidTokenError } from '@ingeze/api-error'
import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'

const AUTH_SECRET = config.jwt.AUTH_TOKEN_SECRET ?? 'secret'
const REFRESH_SECRET = config.jwt.AUTH_REFRESh_SECRET ?? 'secret123'
const RESET_TOKEN_SECRET = config.jwt.RESET_TOKEN_SECRET ?? 'secret123'
const ACCOUNT_ACTIVATE_SECRET = config.jwt.ACCOUNT_ACTIVATE_SECRET ?? 'secret123'

/* auth and refresh token */

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

/* token for mail */

export const generateResetTokenForMail = (data: { _id: string }): string => {
  return jwt.sign(
    {
      _id: data._id
    },
    RESET_TOKEN_SECRET,
    {
      expiresIn: '15m'
    }
  )
}

export const verifyResetTokenForMail = (token: string): string => {
  const decoded = jwt.verify(token, RESET_TOKEN_SECRET) as { _id: string }
  if (!decoded || !decoded._id) {
    throw new InvalidTokenError({ reason: 'Token invalid or expired' })
  }
  return decoded._id
}

/* token for validate account (mail) */

export const generateAccountActivationToken = (data: { _id: string }): string => {
  return jwt.sign(
    {
      _id: data._id
    },
    ACCOUNT_ACTIVATE_SECRET,
    {
      expiresIn: '15m'
    }
  )
}

export const verifyAccountActivationToken = (token: string): string => {
  const decoded = jwt.verify(token, ACCOUNT_ACTIVATE_SECRET) as { _id: string }
  if (!decoded || !decoded._id) {
    throw new InvalidTokenError({ reason: 'Token invalid or expired' })
  }
  return decoded._id
}

