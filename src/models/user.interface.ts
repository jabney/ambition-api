import { Types } from 'mongoose'

export interface IUser {
  _id: Types.ObjectId
  email: string
  first?: string
  last?: string
  roles: string[]
  grants: string[]

  passwordInfo: { password: string, updatedAt?: Date }
}
