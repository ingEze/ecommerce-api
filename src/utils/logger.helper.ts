import logger from './logger.js'

export function logError(err: unknown, route?: string): void {
  if (err instanceof Error) {
    logger.error(err.message, { stack: err.stack, route })
  } else {
    logger.error('Unknown error', { value: err, route })
  }
}
