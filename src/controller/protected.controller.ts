import { NextFunction, Request, Response } from 'express'
import { ProtectedService } from 'src/service/protected.service.js'

export class ProtectedController {
  constructor(private readonly protectedService: ProtectedService) {}
  getAllProducts = async(req: Request, res: Response, next: NextFunction): Promise<void> => {

  }
}
