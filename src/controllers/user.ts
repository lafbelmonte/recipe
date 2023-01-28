import { Request, Response } from 'express'
import createUser from '../libs/create-user'
import { UserRole } from '../types'

export const add = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body

    if (!role) {
      throw new Error('Role is required.')
    }

    if (role !== UserRole.Admin && role !== UserRole.Basic) {
      throw new Error('Roles available are ADMIN or BASIC only.')
    }

    await createUser({ email, password, role })

    res.status(201).json({ message: 'User successfully created.' })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
