import { Types } from 'mongoose'
import { GrantType } from '../config/grants'
import { RoleType } from '../config/roles'

export interface IUser {
  _id: Types.ObjectId
  email: string
  first?: string
  last?: string
  roles: RoleType[]
  grants: GrantType[]
  settings: string

  passwordInfo: { password: string, updatedAt?: Date }
}
