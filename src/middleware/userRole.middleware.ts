import { ForbiddenUserError, UnauthorizedError } from '@ingeze/api-error'
import { NextFunction, Request, Response } from 'express'
import { UserRepository } from '../repository/user.repository.js'

export const roleUserMiddleware = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id
    if (!userId) throw new UnauthorizedError()
    const user = await new UserRepository().findUserById(userId)
    if (!user?.role.includes('User') && !user?.role.includes('Admin')) {
      throw new ForbiddenUserError({ reason: 'Access restricted to "User" role' })
    }
    next()
  } catch (err) {
    next(err)
  }
}
