import { AuthDto } from 'src/dtos/auth.dto.js'
import { InvalidCredentialsError, UserNotFoundError } from '@ingeze/api-error'
import { AuthRepository } from 'src/repository/auth.repository.js'
import { comparePassword, hashedPassword } from 'src/utils/hashPassword.js'
import { parsedData } from 'src/utils/validationFormData.js'
import { generateAuthToken, generateRefreshToken } from 'src/utils/jwt.js'

export class AuthService {
  async register(data: AuthDto): Promise<void> {
    parsedData(data)
    const passwordHash = await hashedPassword(data?.password)
    const userData = {
      email: data.email,
      password: passwordHash
    }
    await new AuthRepository().createUser(userData)
  }

  async login(data: AuthDto): Promise<{ access_token: string, refresh_token: string }> {
    parsedData(data)
    const user = await new AuthRepository().findUserByEmail(data?.email)
    if (!user) throw new UserNotFoundError({ reason: `${data.email} not found` })
    const compared = await comparePassword(data.password, user.password)
    if (!compared) {
      throw new InvalidCredentialsError({ reason: 'Incorrect email or password' })
    }

    const access_token = generateAuthToken(user)
    const refresh_token = generateRefreshToken(user)
    return {
      access_token,
      refresh_token
    }
  }

  async resetPassword(data: AuthDto): Promise<void> {
    parsedData(data)
    const user = await new AuthRepository().findUserByEmail(data?.email)
    if (!user) throw new UserNotFoundError({ reason: `${data.email} not found` })
    const newPasswordHash = await hashedPassword(data.password)
    await new AuthRepository().resetPassword(user._id, newPasswordHash)
  }
}
