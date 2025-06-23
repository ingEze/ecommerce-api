import z from 'zod'

const RegisterSchema = z.object({
  email:z
    .string()
    .email(),
  password: z
    .string()
    .min(8)
})

export type AuthDto = z.infer<typeof RegisterSchema>

export function registerValidationData(input: AuthDto): AuthDto | undefined {
  const result = RegisterSchema.safeParse(input)
  return result.success ? result.data : undefined
}
