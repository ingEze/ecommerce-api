import { ValidationError } from '@ingeze/api-error'
import { AuthDto, registerValidationData } from 'src/dtos/auth.dto.js'

export function parsedData(data: AuthDto): void {
  const parsed = registerValidationData(data)
  if (!parsed) {
    throw new ValidationError()
  }
}
