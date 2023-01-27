import { Document, Schema, model } from 'mongoose'
import { User } from '../types'

export type UserDocument = Omit<User, 'id'> & Document

const schema = new Schema<UserDocument>(
  {
    _id: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    }
  },
  { _id: false }
)

export default model<UserDocument>('User', schema)
