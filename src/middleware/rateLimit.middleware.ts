import rateLimit from 'express-rate-limit'

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15m
  max: 100,
  message: { error: 'Too many request, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
})

export const authRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5m
  max: 5,
  message: { error: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
})

export const forgotPasswordRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { error: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
})
