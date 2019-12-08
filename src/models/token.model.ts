import mongoose, { Document, Schema, Types } from 'mongoose'
import { IToken } from './token.interface'
import schemaOptions from '../config/schema-options'

export interface ITokenDocument extends IToken, Document {
  _id: Types.ObjectId

  /* tokenSchema.methods */
}

type TokenModel = mongoose.Model<ITokenDocument> & {/* tokenSchema.statics */}

export const tokenSchema = new Schema({
  _id: { $type: Schema.Types.ObjectId, required: true },
  // The owner of the token.
  userId: { $type: Schema.Types.ObjectId, required: true },
  // The time the token was issued.
  issuedAt: { $type: Number, required: true },
  // The time the token expires.
  expiresAt: { $type: Number, required: true },
}, schemaOptions())

tokenSchema.index({ userId: 1 })

export const Token = <TokenModel>mongoose.model<ITokenDocument>('Token', tokenSchema)
