export type UserRole =
  | 'USER'
  | 'OPERATOR'
  | 'RESPONDER'
  | 'ADMIN'

export interface User {
  id: number
  fullName: string
  email: string
  role: UserRole
}

export interface AuthResponse {
  token: string
  user: User
}