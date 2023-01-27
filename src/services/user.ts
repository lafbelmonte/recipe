import UserModel from '../models/user'
import { User } from '../types'

const createUser = async (params: User) => {
  await UserModel.create({ _id: params.id, ...params })
}

const findUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email })

  return user
}

export { createUser, findUserByEmail }
