import mongoose, { Document, Schema, Types } from 'mongoose'
import schemaOptions from '../config/schema-options'
import * as tokens from '../lib/tokens'
import { IToken } from './token.interface'
import { timeSec } from '../lib/time'
import env from '../environment'

// The expire time for the ttl index; append 's' for seconds.
const expires = timeSec({ days: env.JWT_EXPIRES_IN_DAYS }) + 's'

export interface ITokenDocument extends IToken, Document {
  _id: Types.ObjectId

  /* tokenSchema.methods */
}

type TokenModel = mongoose.Model<ITokenDocument> & {
  createToken: (userId: Types.ObjectId) => string,

  /* tokenSchema.statics */
}

export const tokenSchema = new Schema({
  _id: { $type: Schema.Types.ObjectId, required: true },
  // The owner of the token.
  userId: { $type: Schema.Types.ObjectId, required: true },
  // The time the token was issued.
  issuedAt: { $type: Number, required: true },
  // The time the token expires.
  expiresAt: { $type: Number, required: true },
  // Used for ttl.
  createdAt: { $type: Date, default: Date.now },
}, schemaOptions())

tokenSchema.index({ userId: 1 })
tokenSchema.index({ createdAt: 1 }, { expires })

/**
 * Create and return a json web token.
 */
tokenSchema.statics.createToken = async function(this: TokenModel, userId: Types.ObjectId) {
  const token = await tokens.sign(userId.toHexString())

  const {
    jti: _id,
    iat: issuedAt,
    exp: expiresAt,
  } = tokens.decode(token)

  const tokenDoc = new this({ _id, userId, issuedAt, expiresAt })
  await tokenDoc.save()

  return token
}

export const Token = mongoose.model<ITokenDocument>('Token', tokenSchema) as TokenModel
