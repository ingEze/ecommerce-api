import { ForbiddenUserError } from '@ingeze/api-error'
import { Request, Response, NextFunction } from 'express'
import { UserRepository } from 'src/repository/user.repository.js'
import { getCurrentUserById } from 'src/utils/getCurrentUserID.js'

export const checkDemoUser = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = getCurrentUserById(req)

    const user = await new UserRepository().findUserById(userId)
    if (!user) return next()

    if (user.role.includes('Demo')) {
      throw new ForbiddenUserError({
        reason: 'Demo users cannot perform this action.'
      })
    }
    next()
  } catch (err) {
    next(err)
  }
}
