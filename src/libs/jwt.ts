import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { User } from '../types'

export const generateToken = (params: Omit<User, 'password' | 'email'>) => {
  const token = jwt.sign(params, 'secret', { expiresIn: '600s' })
  return token
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization']

  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.sendStatus(401)
  }

  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) {
      return res.sendStatus(403)
    }

    req.user = decoded as any

    next()
  })
}
