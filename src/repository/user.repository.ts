import { AuthDto } from 'src/dtos/auth.dto.js'
import { User } from 'src/models/user.schema.js'
import { IUser } from 'src/types/user.types.js'

export class UserRepository {
  async findUserById(userId: string): Promise<IUser | undefined> {
    const user = await User.findById(userId)
    return user ? user : undefined
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email: email })
    return user
  }

  async createUser(data: AuthDto): Promise<IUser> {
    const user = new User(data)
    return await user.save()
  }

  async resetPassword(_id: string, newPassword: string): Promise<void> {
    await User.updateOne(
      { _id: _id },
      { $set: { password: newPassword } }
    )
  }
}
