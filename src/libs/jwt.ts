import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { User } from '../types'

// function to generate token after successful login, stored are role and ID
export const generateToken = (params: Omit<User, 'password' | 'email'>) => {
  const token = jwt.sign(params, 'secret', { expiresIn: '600s' })
  return token
}

// middleware to verify protected routes, and making sure token was sent in the headers
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

    // decoded token data: id and role were being passed to req.user
    req.user = decoded as any

    next()
  })
}
