import { BadRequestError, EmailNotFoundError, InvalidCredentialsError, UnauthorizedError, UserNotFoundError } from '@ingeze/api-error'
import { AuthDto, EmailDto, LoginDto } from '../dtos/auth.dto.js'
import { UserRepository } from '../repository/user.repository.js'
import { comparePassword, hashedPassword } from '../utils/hashPassword.js'
import { generateAccountActivationToken, generateAuthToken, generateRefreshToken, generateResetTokenForMail, verifyResetTokenForMail } from '../utils/jwt.js'
import { EmailService } from './email.service.js'

const emailService = new EmailService()
const userRepository = new UserRepository()

export class AuthService {
  async register(data: AuthDto): Promise<string> {
    const alreadyUsedEmail = await userRepository.findUserByEmail(data.email)
    const alreadyUsedUsername = await userRepository.findUserByUsername(data.username)
    if (alreadyUsedEmail || alreadyUsedUsername) {
      const reason = alreadyUsedEmail
        ? 'Email already used'
        : 'Username already used'

      throw new BadRequestError({ reason })
    }

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

    return token
  }

  async login(data: LoginDto): Promise<{ access_token: string, refresh_token: string }> {
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

  async authMiddleware(userId: string): Promise<{ username: string, email: string, role: string[], createdAt: Date }> {
    const user = await userRepository.findUserById(userId)
    if (!user) {
      throw new UserNotFoundError()
    }
    const data = {
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }

    return data
  }
}
