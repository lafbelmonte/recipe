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
