// typings for entities used in the system

export enum UserRole {
  Basic = 'BASIC',
  Admin = 'ADMIN'
}

export type User = {
  id: string
  email: string
  password: string
  role: UserRole
}

export type Recipe = {
  id: string
  name: string
  ingredients: string
  instructions: string
  createdBy: string
}
