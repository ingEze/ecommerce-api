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
  role: Array<'User' | 'Demo' | 'Admin'>
  isActive: boolean
  products: Types.ObjectId
}

export interface IUpdateUsernameDTO { username: string, password: string }
export interface IUpdatePasswordDTO { password: string, currentPassword: string }
export interface IUpdateEmailDTO { email: string, password: string }
export interface IUpdateStatusAccountDTO { isActive: boolean, password: string }
