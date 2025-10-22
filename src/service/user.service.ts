import { BadRequestError, ErrorHandler, ProductNotFoundError, UnauthorizedError, UserNotFoundError } from '@ingeze/api-error'
import { UserRepository } from '../repository/user.repository.js'
import { IGetAllProducts } from '../types/product.types.js'
import { formatProducts } from '../utils/formatProduct.js'
import { comparePassword, hashedPassword } from '../utils/hashPassword.js'
import { verifyAccountActivationToken } from '../utils/jwt.js'
import { paginate } from '../utils/pagination.js'

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async activeAccount(token: string): Promise<void> {
    const userId = verifyAccountActivationToken(token)
    await this.userRepository.updateStatusAccount(true, userId)
  }

  async getProductsByUser(page: number, limit: number, username: string): Promise<IGetAllProducts> {
    const allProducts = await this.userRepository.getProducts(username)

    if (!allProducts) throw new ProductNotFoundError()

    const totalProducts = allProducts.length
    const pagination = paginate(totalProducts, page, limit)

    const start = (page - 1) * limit
    const end = start + limit
    const paginatedProducts = allProducts.slice(start, end)

    if (!paginatedProducts || paginatedProducts.length === 0) {
      throw new BadRequestError({ reason: 'No products found for the requested page' })
    }

    const formatted = await Promise.all(paginatedProducts.map(p => formatProducts(p)))

    return {
      ...pagination,
      products: formatted
    }
  }

  async updateUsername(data: { username: string, password: string }, userId: string): Promise<{ username: string }> {
    const existingUsername = await this.userRepository.findUserByUsername(data.username)
    if (existingUsername) throw new BadRequestError({ reason: 'Username already exists' })

    const user = await this.userRepository.findUserById(userId)

    const verifyPassword = await comparePassword(data.password, user!.password)
    if (!verifyPassword) throw new UnauthorizedError({ reason: 'Invalid credentials' })

    await this.userRepository.updateUsername({ newUsername: data.username, password: data.password }, userId)
    return {
      username: data.username
    }
  }

  async updatePassword(data: { password: string, currentPassword: string }, userId: string): Promise<void> {
    const user = await this.userRepository.findUserById(userId)

    const verifyPassword = await comparePassword(data.currentPassword, user!.password)
    if (!verifyPassword) throw new UnauthorizedError({ reason: 'Invalid credentials' })

    const password = await hashedPassword(data.password)
    await this.userRepository.updatePassword(password, userId)
  }

  async updateEmail(data: { email: string, password: string }, userId: string): Promise<{ email: string }> {
    const existingEmail = await this.userRepository.findUserByEmail(data.email)
    if (existingEmail) {
      throw new ErrorHandler(
        'Resource already exists',
        409,
        'DUPLICATE_RESOURCE',
        {
          reason: 'Email already exists'
        }
      )
    }

    const user = await this.userRepository.findUserById(userId)
    if (!user) throw new UserNotFoundError()

    const verifyPassword = await comparePassword(data.password, user.password)
    if (!verifyPassword) throw new UnauthorizedError({ reason: 'Invalid credentials' })

    await this.userRepository.updateEmail(data.email, userId)

    return {
      email: data.email
    }
  }

  async updateStatusAccount(data: { isActive: boolean, password: string }, userId: string): Promise<void> {
    const user = await this.userRepository.findUserById(userId)
    if (!user) throw new UserNotFoundError()

    const verifyPassword = await comparePassword(data.password, user.password)
    if (!verifyPassword) throw new UnauthorizedError({ reason: 'Invalid credentials' })

    await this.userRepository.updateStatusAccount(data.isActive, userId)
  }
}
