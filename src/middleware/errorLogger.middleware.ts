import { Request, Response, NextFunction } from 'express'
import { logError } from '../utils/logger.helper.js'

export const errorLogger = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
  logError(err, req.originalUrl)
  next(err)
}
