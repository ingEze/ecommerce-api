import { AuthDto, EmailDto, LoginDto, ValidateLogin } from 'src/dtos/auth.dto.js'
import { EmailNotFoundError, InvalidCredentialsError, UnauthorizedError, UserNotFoundError } from '@ingeze/api-error'
import { UserRepository } from 'src/repository/user.repository.js'
import { comparePassword, hashedPassword } from 'src/utils/hashPassword.js'
import { generateAccountActivationToken, generateAuthToken, generateRefreshToken, generateResetTokenForMail, verifyAccountActivationToken, verifyResetTokenForMail } from 'src/utils/jwt.js'
import { EmailService } from './email.service.js'

const emailService = new EmailService()
const userRepository = new UserRepository()

export class AuthService {
  async register(data: AuthDto): Promise<void> {
    const role = data.role ?? 'User'

    const passwordHash = await hashedPassword(data.password)

    const userData = {
      email: data.email,
      username: data.username,
      password: passwordHash,
      role: role,
      isActive: false
    }

    const user = await new UserRepository().createUser(userData)

    const token = generateAccountActivationToken({ _id: user._id })
    await emailService.sendVerificationAccountEmail(user.email, token)
  }

  async activeAccount(token: string): Promise<void> {
    const userId = verifyAccountActivationToken(token)
    await userRepository.updateStatusAccount(true, userId)
  }

  async login(data: LoginDto): Promise<{ access_token: string, refresh_token: string }> {
    ValidateLogin(data)

    const user = await new UserRepository().findUserByEmail(data?.email)
    if (!user) throw new UserNotFoundError({ reason: `${data.email} not found` })

    const isActive = user.isActive
    if (!isActive) {
      throw new UnauthorizedError({ reason: 'Email is not actived' })
    }

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

  async requestPasswordReset(data: EmailDto): Promise<void> {
    const user = await new UserRepository().findUserByEmail(data?.email)
    if (!user) throw new EmailNotFoundError({ reason: 'If an account with that email exists, you will receive a password reset email shortly' })

    const token = generateResetTokenForMail({ _id: user._id })
    await emailService.sendResetEmail(user.email, token)
  }

  async resetPassword(data: { token: string, password: string }): Promise<void> {
    const userId = verifyResetTokenForMail(data.token)

    const user = await userRepository.findUserById(userId)
    if (!user) throw new UserNotFoundError()

    const hashPassword = await hashedPassword(data.password)

    await userRepository.updatePassword(hashPassword, user?._id)

  }
}
