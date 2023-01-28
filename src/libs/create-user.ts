import { User } from '../types'
import validEmail from '../libs/valid-email'
import * as UserService from '../services/user'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

// reusable function for creating user, used by add user and registration
export default async function (params: Omit<User, 'id'>) {
  const { email, password, role } = params

  // email validation
  if (!email) {
    throw new Error('Email is required.')
  }

  // password validation
  if (!password) {
    throw new Error('Password is required.')
  }

  // check if email has a valid format
  if (!validEmail(email)) {
    throw new Error('Email is invalid.')
  }

  // check if email is already registered
  const user = await UserService.findUserByEmail(email)

  if (user) {
    throw new Error('Account already exists.')
  }

  // hash the password before saving in the database
  const hashedPassword = await bcrypt.hash(password, 10)

  // save to database
  await UserService.createUser({
    id: uuidv4(),
    email,
    password: hashedPassword,
    role
  })
}
