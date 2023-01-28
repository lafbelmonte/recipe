import { Request, Response } from 'express'
import createUser from '../libs/create-user'
import { UserRole } from '../types'
import * as UserService from '../services/user'
import validEmail from '../libs/valid-email'

export const add = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body

    // role validation
    if (!role) {
      throw new Error('Role is required.')
    }

    // only BASIC and ADMIN are valid roles
    if (role !== UserRole.Admin && role !== UserRole.Basic) {
      throw new Error('Roles available are ADMIN or BASIC only.')
    }

    // utilizes reusable function for creating user
    await createUser({ email, password, role })

    res.status(201).json({ message: 'User successfully created.' })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

export const list = async (req: Request, res: Response) => {
  try {
    // fetch data from the database
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

    // check if user is in the database
    if (!user) {
      throw new Error('User not found.')
    }

    // check if the role being updated is valid
    if (
      body.role &&
      body.role !== UserRole.Admin &&
      body.role !== UserRole.Basic
    ) {
      throw new Error('Roles available are ADMIN or BASIC only.')
    }

    if (body.email) {
      // check if email format is valid
      if (!validEmail(body.email)) {
        throw new Error('Email is invalid.')
      }

      // ensuring email is not taken by other users
      const usersWithSameEmails = await UserService.findUsers({
        _id: { $ne: id },
        email: body.email
      })

      if (usersWithSameEmails.length > 0) {
        throw new Error('Email already exists.')
      }
    }

    // update data in the database
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

    // check if user exists in the database
    if (!user) {
      throw new Error('User not found.')
    }

    // delete user in the database
    await UserService.deleteUserById(id)

    res.status(200).json({ message: 'User successfully deleted.' })
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
