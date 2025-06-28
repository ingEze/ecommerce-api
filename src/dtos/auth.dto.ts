import z from 'zod'

const RegisterSchema = z.object({
  email: z
    .string()
    .email(),
  username: z
    .string()
    .min(3, 'Username must be 3 characters or more')
    .max(20, 'Username must be 20 character or minor'),
  password: z
    .string()
    .min(8, 'Password must be 8 characters or more'),
  role: z
    .enum(['User', 'Seller'])
    .optional()
}).strict()

const LoginOrResetPasswordSchema = z.object({
  email: z
    .string()
    .email(),
  password: z
    .string()
    .min(8, 'Password must be 8 character or more')
}).strict()

export type AuthDto = z.infer<typeof RegisterSchema>
export type LoginOrResetPasswordDto = z.infer<typeof LoginOrResetPasswordSchema>

export function registerValidationData(input: AuthDto): AuthDto {
  const result = RegisterSchema.safeParse(input)
  if (!result.success) {
    throw result.error
  }
  return result.data
}

export function loginOrResetValidation(input: LoginOrResetPasswordDto): LoginOrResetPasswordDto {
  const result = LoginOrResetPasswordSchema.safeParse(input)
  if (!result.success) {
    throw result.error
  }
  return result.data
}
