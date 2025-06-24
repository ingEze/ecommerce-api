import { UnauthorizedError } from '@ingeze/api-error'
import { Request } from 'express'

export function getCurrentUserId(req: Request): string {
  if (!req.user?._id) throw new UnauthorizedError({ reason: 'User not authorized' })
  return req.user?._id
}
