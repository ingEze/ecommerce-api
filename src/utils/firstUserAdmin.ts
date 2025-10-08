import { User } from 'src/models/user.schema.js'
import { hashedPassword } from './hashPassword.js'
import { config } from 'src/config/index.js'

export async function createAdminIfNotExists(): Promise<void> {
  const userCount = await User.countDocuments()

  if (userCount === 0) {
    const userEmail = config.adminUser.ADMIN_EMAIL
    const userPassword = config.adminUser.ADMIN_PASSWORD
    const hashPass = await hashedPassword(userPassword)

    const adminUser = new User ({
      email: userEmail,
      password: hashPass,
      role: 'Admin'
    })

    await adminUser.save()
    console.log('User admin created')
  }
}
