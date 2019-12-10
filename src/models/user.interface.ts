import { Types } from 'mongoose'
import { RoleType } from '../config/roles'
import { GrantType } from '../config/grants'

export interface IUser {
  _id: Types.ObjectId
  email: string
  first?: string
  last?: string
  roles: RoleType[]
  grants: GrantType[]

  passwordInfo: { password: string, updatedAt?: Date }
}
