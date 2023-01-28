import { Request, Response } from 'express'
import createUser from '../libs/create-user'
import { UserRole } from '../types'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // utilizes reusable function for creating user
    await createUser({ email, password, role: UserRole.Basic })

    res.status(201).json({ message: 'Account successfully created.' })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
