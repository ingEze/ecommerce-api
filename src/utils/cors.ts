import { ForbiddenError } from '@ingeze/api-error'
import { CorsOptions } from 'cors'
import logger from './logger.js'

const ACCEPTED_ORIGINS = [
  'http://localhost:3033',
  'http://localhost:5173'
]

export const myCors = (): CorsOptions => ({
  origin: (origin, callback): void => {
    if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
      callback(null, true)
    } else {
      logger.error(`CORS not allowed: ${origin}`)
      callback(new ForbiddenError({ reason: 'CORS not allowed' }))
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
})
