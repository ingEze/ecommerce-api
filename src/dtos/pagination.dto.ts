import { BadRequestError } from '@ingeze/api-error'

export const validatePaginationParams = (page: number, limit: number): boolean => {
  if (isNaN(limit) || limit < 1) {
    throw new BadRequestError({
      reason: 'The "limit" parameter must be a number greater than or equal to 1'
    })
  }
  if (isNaN(page) || page < 1) {
    throw new BadRequestError({
      reason: 'The "page" parameter must be a number greater than or equal to 1'
    })
  }
  return true
}
