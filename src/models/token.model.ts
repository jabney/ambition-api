import mongoose, { Document, Schema, SchemaTypes } from 'mongoose'
import { IToken } from './token.interface'

const { ObjectId } = SchemaTypes

export interface ITokenModel extends IToken, Document {}

export const tokenSchema = new Schema({
  // The owner of the token.
  userId: { $type: ObjectId, required: true },
  // The time the token was issued.
  issuedAt: { $type: Number, required: true },
  // The time the token expires.
  expiresAt: { $type: Number, required: true },
})

export const Token = mongoose.model<ITokenModel>('Token', tokenSchema)
