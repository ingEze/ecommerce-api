import { ValidationUserError } from '@ingeze/api-error'

export function checkRequiredFields(arg1: string, arg2: string): void {
  const missing = []
  if (!arg1) missing.push(`${arg1} can't be empty`)
  if (!arg2) missing.push(`${arg2} can't be empty`)
  if (missing.length) {
    throw new ValidationUserError({ message: missing.join('. '), missing })
  }
}
