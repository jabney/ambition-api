import { Types } from 'mongoose'

export interface IToken {
  _id: Types.ObjectId
  userId: Types.ObjectId
  issuedAt: number
  expiresAt: number
}
