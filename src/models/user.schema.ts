import mongoose, { Schema } from 'mongoose'
import { IUser } from 'src/types/user.types.js'

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
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
    enum: ['User', 'Admin'],
    default: ['User']
  },
  isActive: {
    type: Boolean,
    default: false
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
