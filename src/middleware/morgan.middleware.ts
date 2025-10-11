import morgan from 'morgan'
import logger from '../utils/logger'

export const morganMiddleware = morgan(
  'combined',
  {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }
)
