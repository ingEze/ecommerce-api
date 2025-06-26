import { Types } from 'mongoose'

export interface CreateUser {
  email: string,
  password: string
}

export interface IUser extends Document {
  _id: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  role: Array<'User' | 'Seller' | 'Admin'>
  products: Types.ObjectId[]
}
