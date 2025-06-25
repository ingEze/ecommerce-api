import { ProductDto } from 'src/types/product.types.js'
import z from 'zod'

const ProductSchema = z.object({
  title: z.string(),
  price: z.number(),
  description: z.string()
})

export function ProductValidation(input: ProductDto): ProductDto | undefined {
  const result = ProductSchema.safeParse(input)
  return result.success ? result.data : undefined
}
