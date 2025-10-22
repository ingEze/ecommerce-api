import { IQueryDTO } from '../types/product.types.js'
import z from 'zod'

const querySchema = z.object({
  username: z
    .string()
    .min(3)
    .optional(),
  search: z
    .string()
    .min(1)
    .optional(),
  minPrice: z
    .union([
      z
        .literal('free'),
      z
        .number()
        .min(0.1)
        .positive()
    ])
    .optional(),
  maxPrice: z
    .number()
    .positive()
    .optional(),
  sort: z
    .enum(['price_asc', 'price_desc'])
    .optional()
}).strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided'
  })

export function validateQuerys(input: IQueryDTO): IQueryDTO  {
  const result = querySchema.safeParse(input)

  if (!result.success) {
    throw result.error
  }

  return result.data
}
