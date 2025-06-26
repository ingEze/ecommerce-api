import mongoose, { Schema } from 'mongoose'
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
  },
  role: {
    type: [String],
    enum: ['User', 'Seller', 'Admin'],
    default: ['User']
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Products'
    }
  ]
},
{ timestamps:  true }
)

export const User = mongoose.model<IUser>('User', UserSchema)
