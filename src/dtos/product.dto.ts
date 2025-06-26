import { ProductDto } from 'src/types/product.types.js'
import z from 'zod'

const ProductSchemaDto = z.object({
  title: z.string().min(1, 'Title is required'),
  price: z.number().positive('Price must be a positive number'),
  description: z.string().min(1, 'Description is required'),
  quantity: z
    .number()
    .positive()
    .default(1)
})

export function ProductValidation(input: ProductDto): ProductDto | undefined {
  const result = ProductSchemaDto.safeParse(input)
  return result.success ? result.data : undefined
}
