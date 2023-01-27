import { User } from '../types'
import validEmail from '../libs/valid-email'
import * as UserService from '../services/user'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

export default async function (params: Omit<User, 'id'>) {
  const { email, password, role } = params

  if (!email) {
    throw new Error('Email is required.')
  }

  if (!password) {
    throw new Error('Password is required.')
  }

  if (!validEmail(email)) {
    throw new Error('Email is invalid.')
  }

  const user = await UserService.findUserByEmail(email)

  if (user) {
    throw new Error('Account already exists.')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await UserService.createUser({
    id: uuidv4(),
    email,
    password: hashedPassword,
    role
  })
}
