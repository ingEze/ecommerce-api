import { ProductDto, ProductUpdateDto } from '../types/product.types.js'
import z from 'zod'

const ProductSchemaDto = z.object({
  title: z
    .string()
    .min(1, 'Title is required'),
  price: z
    .number()
    .positive('Price must be a positive number'),
  description: z
    .string()
    .min(1, 'Description is required'),
  quantity: z
    .number()
    .positive('Quantity must be a positive number')
    .default(1)
}).strict()

const ProductUpdateSchemaDto = z.object({
  title: z
    .string()
    .optional(),
  price: z
    .number()
    .positive('Price must be a positive number')
    .optional(),
  description: z
    .string()
    .optional(),
  quantity: z
    .number()
    .positive('Quantity must be a positive number')
    .optional()
})
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided'
  })

export const ProductOrProductsSchema = z
  .union([ProductSchemaDto, z.array(ProductSchemaDto)])
  .transform(input => Array.isArray(input) ? input : [input])

export function ProductValidation(input: ProductDto[]): ProductDto[] | undefined {
  const result = ProductOrProductsSchema.safeParse(input)

  if (!result.success) {
    throw result.error
  }

  return result.data
}

export function ProductUpdateValidation(input: ProductUpdateDto): ProductUpdateDto | undefined {
  const result = ProductUpdateSchemaDto.safeParse(input)
  if (!result.success) {
    throw result.error
  }
  return result.data
}
