import { Request, Response, NextFunction } from 'express'
import { UserRole } from '../types'

export const user = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req

  if (user?.role !== UserRole.Admin) {
    return res.sendStatus(403)
  }

  next()
}