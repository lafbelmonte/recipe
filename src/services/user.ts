import UserModel from '../models/user'
import { User } from '../types'

const createUser = async (params: User) => {
  await UserModel.create({ _id: params.id, ...params })
}

const findUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email })

  return user
}

const findUserById = async (id: string) => {
  const user = await UserModel.findOne({ _id: id })

  return user
}

const findAllUsers = async () => {
  const users = await UserModel.find({})

  return users
}

const findUsers = async (filter: Record<string, any>) => {
  const users = await UserModel.find(filter)

  return users
}

const updateUserById = async (id: string, body: Record<string, any>) => {
  await UserModel.updateOne({ _id: id }, body)
}

const deleteUserById = async (id: string) => {
  await UserModel.deleteOne({ _id: id })
}

export {
  createUser,
  findUserByEmail,
  findAllUsers,
  updateUserById,
  findUserById,
  findUsers,
  deleteUserById
}
