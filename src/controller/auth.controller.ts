import { Request, Response, NextFunction } from 'express'
import { AuthService } from 'src/service/auth.service.js'
import { checkRequiredFields } from 'src/utils/dataEmptyError.js'

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body
      checkRequiredFields(email, password)
      await this.authService.register({ email, password })

      res.status(201).json({
        success: true,
        messahe: 'User created'
      })
    } catch (err) {
      next(err)
    }
  }

  login = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    console.log(req.body)
    try {
      const { email, password } = req.body
      checkRequiredFields(email, password)

      await this.authService.login({ email, password })

      res.status(200).json({
        success: true,
        message: 'Login successfully'
      })
    } catch (err) {
      next(err)
    }
  }
}
