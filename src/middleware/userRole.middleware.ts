import { ForbiddenUserError, UnauthorizedError } from '@ingeze/api-error'
import { NextFunction, Request, Response } from 'express'
import { UserRepository } from 'src/repository/user.repository.js'

export const roleSellerMiddleware = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id
    if (!userId) throw new UnauthorizedError()
    const user = await new UserRepository().findUserById(userId)
    if (!user) throw new UnauthorizedError()
    if (!user.role.includes('Seller')) {
      throw new ForbiddenUserError({ reason: 'Access restricted to "Seller" role' })
    }
    next()
  } catch (err) {
    next(err)
  }
}
