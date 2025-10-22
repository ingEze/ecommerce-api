import z from 'zod'

const BasePaymentSchema = z.object({
  method: z.enum(['credit_card', 'paypal'])
})

const CreditCardPaymentSchema = z.object({
  cardNumber: z.string().min(16).max(16).optional(),
  fistName: z.string().optional(),
  lastName: z.string().optional(),
  expiration: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/).optional(), // MM/YY
  cvv: z.string().min(3).max(4).optional()
})

const PaypalPaymentSchema = z.object({
  transactionId: z.string(),
  payerEmail: z.string().email()
})

const PaymentSchemaDto = z.union([
  BasePaymentSchema.extend({
    method: z.literal('credit_card'),
    details: CreditCardPaymentSchema
  }),
  BasePaymentSchema.extend({
    method: z.literal('paypal'),
    details: PaypalPaymentSchema
  })
])

export type PaymentDto = z.infer<typeof PaymentSchemaDto>

export function ValidatePayment(input: PaymentDto): PaymentDto {
  const result = PaymentSchemaDto.safeParse(input)
  if (!result.success) {
    throw result.error
  }
  return result.data
}
