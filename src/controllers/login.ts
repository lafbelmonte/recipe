import { Request, Response } from 'express'
import validEmail from '../libs/valid-email'
import * as jwt from '../libs/jwt'
import * as UserService from '../services/user'
import bcrypt from 'bcrypt'

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

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

    if (!user) {
      throw new Error('Email not found.')
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      throw new Error('Incorrect password.')
    }

    const token = jwt.generateToken({
      id: user.id,
      role: user.role
    })

    res.status(200).json({ message: 'Login successful.', token })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
