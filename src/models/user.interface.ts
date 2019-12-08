import { Types } from 'mongoose'

export interface IUser {
  email: string
  first?: string
  last?: string
  roles: string[]

  passwordInfo: { password: string, updatedAt: Date }
}
