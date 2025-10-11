import { Request, Response, NextFunction } from 'express'
import { logError } from 'src/utils/logger.helper'

export const errorLogger = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
  logError(err, req.originalUrl)
  next(err)
}
