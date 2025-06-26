import { ValidationUserError } from '@ingeze/api-error'

export function checkRequiredFields(data: Record<string, unknown>): void {
  const missing = []
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null || value === '') {
      missing.push(`${key} can't be empty`)
    }
  }

  if (missing.length) {
    throw new ValidationUserError({
      reason: missing.join('. '),
      missing
    })
  }
}
