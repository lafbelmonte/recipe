import { User } from '../../types'

// used to extend type from the Request object from express
declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, 'email' | 'password'>
    }
  }
}
