import { Request, Response, NextFunction } from 'express'
import { UserRepository } from '../repository/user.repository.js'

const userRepository = new UserRepository()

export const checkIsActive = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      })
      return
    }

    const user = await userRepository.findUserById(userId)
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      })
      return
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Your account is not active. Please check your email to validate it.'
      })
      return
    }

    next()
  } catch (err) {
    next(err)
  }
}
