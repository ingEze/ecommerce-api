import { UnauthorizedError } from '@ingeze/api-error'
import { Request } from 'express'

export function getCurrentUserById(req: Request): string {
  const userId = req.user?._id
  if (!userId) throw new UnauthorizedError({ reason: 'User not authorized' })
  return userId
}
