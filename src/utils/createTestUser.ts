import { User } from '../models/user.schema.js'
import { hashedPassword } from './hashPassword.js'
import logger from './logger.js'

export async function createDemoUser(): Promise<void> {
  try {
    if (process.env.NODE_ENV === 'production') {
      logger.info('Skipping demo user creation in production')
      return
    }

    const email = 'admin@example.com'
    const username = 'demoUser'
    const existingEmail = await User.findOne({ email })
    const existingUsername = await User.findOne({ username })
    if (existingEmail || existingUsername) {
      logger.info('Demo user already exists (email or username)')
      return
    }

    const password = 'Admin123!'
    const hashPass = await hashedPassword(password)

    const demoUser = new User({
      email,
      username,
      password: hashPass,
      role: 'Demo',
      isActive: true
    })

    await demoUser.save()
    logger.info('Demo user created successfully')
  } catch (err) {
    logger.error('Failed to create demo user', err)
  }
}
