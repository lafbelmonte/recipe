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
  {
    _id: false,
    toJSON: {
      // parse document output. _id should be id and __v should be removed
      transform(_doc: {}, ret: Document) {
        ret.id = ret._id

        delete ret._id
        delete ret.__v
      },
      virtuals: true
    }
  }
)

export default model<UserDocument>('User', schema)
