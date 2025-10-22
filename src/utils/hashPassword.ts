import bcrypt from 'bcrypt'

const SALT = 10
export async function hashedPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT)
}

/**
 *  @param newPassword: string
 *  @param currentPassowrd: string
 *
 * @returns Promise<bollean>
*/
export async function comparePassword(newPassword: string, currentPassowrd: string): Promise<boolean> {
  return await bcrypt.compare(newPassword, currentPassowrd)
}
