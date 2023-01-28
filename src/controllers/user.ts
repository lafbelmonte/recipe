import { Request, Response } from 'express'
import createUser from '../libs/create-user'
import { UserRole } from '../types'
import * as UserService from '../services/user'
import validEmail from '../libs/valid-email'

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

export const list = async (req: Request, res: Response) => {
  try {
    const users = await UserService.findAllUsers()

    res.status(200).json({ users })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const { body } = req

    const user = await UserService.findUserById(id)

    if (!user) {
      throw new Error('User not found.')
    }

    if (
      body.role &&
      body.role !== UserRole.Admin &&
      body.role !== UserRole.Basic
    ) {
      throw new Error('Roles available are ADMIN or BASIC only.')
    }

    if (body.email) {
      if (!validEmail(body.email)) {
        throw new Error('Email is invalid.')
      }

      const usersWithSameEmails = await UserService.findUsers({
        _id: { $ne: id },
        email: body.email
      })

      if (usersWithSameEmails.length > 0) {
        throw new Error('Email already exists.')
      }
    }

    await UserService.updateUserById(id, body)

    res.status(200).json({ message: 'User successfully updated.' })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const user = await UserService.findUserById(id)

    if (!user) {
      throw new Error('User not found.')
    }

    await UserService.deleteUserById(id)

    res.status(200).json({ message: 'User successfully deleted.' })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
