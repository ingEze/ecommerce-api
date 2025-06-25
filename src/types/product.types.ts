import { Types } from 'mongoose'
import { IUser } from 'src/types/user.types.js'

export interface IProductSchema {
  title: string,
  price: number,
  description: string,
  owner: Types.ObjectId | IUser
}

export interface ProductDto {
  title: string,
  price: number,
  description: string
}
