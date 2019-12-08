import mongoose, { Document, Schema, Types, SchemaTypes } from 'mongoose'
import { IToken } from './token.interface'

const { ObjectId } = SchemaTypes

export interface ITokenDocument extends IToken, Document {
  _id: Types.ObjectId

  /* tokenSchema.methods */
}

type TokenModel = mongoose.Model<ITokenDocument> & {/* tokenSchema.statics */}

export const tokenSchema = new Schema({
  // The owner of the token.
  userId: { $type: ObjectId, required: true },
  // The time the token was issued.
  issuedAt: { $type: Number, required: true },
  // The time the token expires.
  expiresAt: { $type: Number, required: true },
})

export const Token = <TokenModel>mongoose.model<ITokenDocument>('Token', tokenSchema)
