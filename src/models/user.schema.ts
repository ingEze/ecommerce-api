import mongoose from 'mongoose'
import { IUser } from 'src/types/user.types.js'

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
},
{ timestamps:  true }
)

export const User = mongoose.model<IUser>('User', UserSchema)
