import { Types } from 'mongoose'

export interface IToken {
  userId: Types.ObjectId
  issuedAt: number
  expiresAt: number
}
