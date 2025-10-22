import mongoose from 'mongoose'
import { IRefreshToken } from '../types/token.types.js'

const RefreshTokenSchema = new mongoose.Schema<IRefreshToken>({
  token: String,
  userId: String,
  expiresAt: Date
})

export const refreshToken = mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema)
