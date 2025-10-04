import { Types } from 'mongoose'

export interface CreateUser {
  email: string,
  password: string
}

export interface IUser extends Document {
  _id: string
  email: string
  username: string
  password: string
  createdAt: Date
  updatedAt: Date
  role: Array<'User' | 'Admin'>
  isActive: boolean
  products: Types.ObjectId
}

export interface IUpdateUsernameDTO { newUsername: string, password: string }
export interface IUpdatePasswordDTO { newPassword: string, password: string }
export interface IUpdateEmailDTO { newEmail: string, password: string }
export interface IUpdateStatusAccountDTO { isActive: boolean, password: string }
