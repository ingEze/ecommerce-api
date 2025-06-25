import { ValidationUserError } from '@ingeze/api-error'

export function checkRequiredFields(arg: string[] = []): void {
  const missing = []
  for (let i = 0; i < arg.length; i++) {
    if (!arg.push()) missing.push(`${arg[i]} can't be empty`)
  }
  if (missing.length) {
    throw new ValidationUserError({ message: arg.join('. '), missing })
  }
}
