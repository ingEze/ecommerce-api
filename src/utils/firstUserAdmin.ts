import { User } from '../models/user.schema.js'
import { hashedPassword } from './hashPassword.js'
import { config } from '../config/index.js'
import logger from './logger.js'

export async function createAdminIfNotExists(): Promise<void> {
  try {
    if (process.env.NODE_ENV === 'production') {
      const userCount = await User.countDocuments()

      if (userCount === 0) {
        const userEmail = config.adminUser.ADMIN_EMAIL
        const userPassword = config.adminUser.ADMIN_PASSWORD
        const username = config.adminUser.ADMIN_USERNAME
        const hashPass = await hashedPassword(userPassword)

        const adminUser = new User ({
          email: userEmail,
          username: username,
          password: hashPass,
          role: 'Admin',
          isActive: true
        })

        await adminUser.save()
        logger.info('User admin created')
      }
    }
  } catch (err) {
    console.error(err)
    logger.error(err)
  }
}
