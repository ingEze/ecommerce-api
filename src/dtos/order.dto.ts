import { BadRequestError } from '@ingeze/api-error'
import z from 'zod'

const ItemSchema = z.object({
  productId: z.string().min(24),
  title: z.string(),
  price: z.number().positive(),
  quantity: z.number().positive()
})

const ShippingAddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  zip: z.string()
})

const OrderSchemaDto = z.object({
  userId: z.string().min(24),
  items: z.array(ItemSchema),
  total: z.number().positive().optional(),
  totalWithWax: z.number().positive().optional(),
  status: z.enum(['pending', 'paid', 'shipped', 'complete', 'cancelled', 'failed']),
  shippingAddress: ShippingAddressSchema
})

export type OrderDto = z.infer<typeof OrderSchemaDto>

export function ValidateOrder(input: OrderDto): OrderDto {
  const result = OrderSchemaDto.safeParse(input)
  if (!result.success) {
    const errors = result.error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message
    }))
    throw new BadRequestError({ errors })
  }
  return result.data
}

