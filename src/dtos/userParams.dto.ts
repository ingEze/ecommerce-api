import { IUpdateEmailDTO, IUpdatePasswordDTO, IUpdateStatusAccountDTO, IUpdateUsernameDTO } from 'src/types/user.types.js'
import z from 'zod'

const UpdateUsernameSchema = z.object({
  newUsername: z
    .string()
    .min(3)
    .max(16),
  password: z
    .string()
    .min(8)
})

const UpdatePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8),
  password: z
    .string()
    .min(8)
})

const UpdateEmailSchema = z.object({
  newEmail: z
    .string()
    .email()
    .min(1),
  password: z
    .string()
    .min(8)
})

const UpdateStatusAccountSchema = z.object({
  isActive: z.boolean(),
  password: z
    .string()
    .min(8)
})

export function validateUpdateUsername(input: IUpdateUsernameDTO): IUpdateUsernameDTO {
  const result = UpdateUsernameSchema.safeParse(input)
  if (!result.success) {
    throw result.error
  }
  return result.data
}

export function validateUpdatePassword(input: IUpdatePasswordDTO): IUpdatePasswordDTO {
  const result = UpdatePasswordSchema.safeParse(input)
  if (!result.success) {
    throw result.error
  }
  return result.data
}

export function validateUpdateEmail(input: IUpdateEmailDTO): IUpdateEmailDTO {
  const result = UpdateEmailSchema.safeParse(input)
  if (!result.success) {
    throw result.error
  }
  return result.data
}

export function validateUpdateStatusAccount(input: IUpdateStatusAccountDTO): IUpdateStatusAccountDTO {
  const result = UpdateStatusAccountSchema.safeParse(input)
  if (!result.success) {
    throw result.error
  }
  return result.data
}
