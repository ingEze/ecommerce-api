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
    .enum(['User'])
    .optional()
}).strict()

const LoginSchema = z.object({
  email: z
    .string()
    .email(),
  password: z
    .string()
    .min(8, 'Password must be 8 character or more')
}).strict()

const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(8)
})

const EmailSchema = z.object({
  email: z.string().email().min(3)
})

export type AuthDto = z.infer<typeof RegisterSchema>
export type LoginDto = z.infer<typeof LoginSchema>
export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>
export type EmailDto = z.infer<typeof EmailSchema>

export function registerValidationData(input: AuthDto): AuthDto {
  const result = RegisterSchema.safeParse(input)
  if (!result.success) {
    throw result.error
  }
  return result.data
}

export function ValidateLogin(input: LoginDto): LoginDto {
  const result = LoginSchema.safeParse(input)
  if (!result.success) {
    throw result.error
  }
  return result.data
}

export function ValidateResetPassword(input: ResetPasswordDto): ResetPasswordDto {
  const result = ResetPasswordSchema.safeParse(input)
  if (!result.success) {
    throw result.error
  }
  return result.data
}

export function ValidateEmail(input: EmailDto): EmailDto {
  const result = EmailSchema.safeParse(input)
  if (!result.success) throw result.error
  return result.data
}
