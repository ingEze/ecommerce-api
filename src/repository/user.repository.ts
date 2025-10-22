import { UserNotFoundError } from '@ingeze/api-error'
import { AuthDto } from '../dtos/auth.dto.js'
import { Products } from '../models/product.schema.js'
import { User } from '../models/user.schema.js'
import { IProductSchema } from '../types/product.types.js'
import { IUser } from '../types/user.types.js'

export class UserRepository {
  async findUserById(userId: string): Promise<IUser | undefined> {
    const user = await User.findById(userId)
    if (!user) throw new UserNotFoundError({ reason: 'User not found' })
    return user
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email: email })
    return user
  }

  async findUserByUsername(username: string): Promise<IUser | null> {
    const user = await User.findOne({ username: username })
    return user
  }

  async getStatusAccount(userId: string): Promise<boolean> {
    const user = await User.findOne(
      { _id: userId },
      { isActive: true }
    )

    return user?.isActive ?? false
  }

  async createUser(data: AuthDto): Promise<IUser> {
    const user = new User(data)
    return await user.save()
  }

  async getProducts(username: string): Promise<IProductSchema[] | undefined> {
    const user = await User.findOne({ username: username, isActive: true })
    if (!user) {
      throw new UserNotFoundError({ reason: 'User not found' })
    }

    const products = await Products.find(
      { _id: { $in: user?.products },
        isActive: true
      })

    return products
  }

  async updateUsername(data: { newUsername: string, password: string }, userId: string): Promise<void> {
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { username: data.newUsername } },
      { runValidators: true }
    )
  }

  async updatePassword(newPassword: string, userId: string): Promise<void> {
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { password: newPassword } },
      { runValidators: true }
    )
  }

  async updateEmail(newEmail: string, userId: string): Promise<void> {
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { email: newEmail } },
      { runValidators: true }
    )
  }

  async updateStatusAccount(isActive: boolean, userId: string): Promise<void> {
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { isActive: isActive } },
      { runValidators: true }
    )
  }
}
