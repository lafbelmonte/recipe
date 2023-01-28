import { Request, Response } from 'express'
import validEmail from '../libs/valid-email'
import * as jwt from '../libs/jwt'
import * as UserService from '../services/user'
import bcrypt from 'bcrypt'

// logic for login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

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

    // check if the email is belonging to an existing user
    const user = await UserService.findUserByEmail(email)

    if (!user) {
      throw new Error('Email not found.')
    }

    // compare if given password matches the hashed password in the database
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      throw new Error('Incorrect password.')
    }

    // generate token having payload of id and role
    const token = jwt.generateToken({
      id: user.id,
      role: user.role
    })

    res.status(200).json({ message: 'Login successful.', token })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
