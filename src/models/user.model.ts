import mongoose, { Document, Schema, Types } from 'mongoose'
import { IUser } from './user.interface'
import schemaOptions from '../config/schema-options'
import env from '../environment'
import bcrypt from 'bcrypt'
import * as tokens from '../lib/tokens'

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId
  accessToken: () => Promise<string>
  verifyToken: (token: string) => Promise<boolean>
  hasRole: (role: string) => boolean
  verifyPassword: (password: string) => Promise<boolean>
}

type UserModel = mongoose.Model<IUserDocument> & {
  decodeToken: (token: string) => Promise<tokens.IToken>
}

/**
 * Define the schema for a user's password info object.
 */
const passwordInfoSchema = new Schema({
  password: { $type: String, required: true },
  updatedAt: { $type: Date, default: Date.now },
}, schemaOptions({ _id: false }))

/**
 * Define the schema for a user record.
 */
export const userSchema = new Schema({
  email: { $type: String, required: true },
  first: String,
  last: String,
  roles: { $type: [String], enum: ['admin'] },
  grants: { $type: [String], enum: ['track-location'] },
  passwordInfo: { $type: passwordInfoSchema, required: true },
}, schemaOptions())

// Unique email.
userSchema.index({ email: 1 }, { unique: true })

/**
 *
 */
userSchema.pre('save', async function (this: IUserDocument, next) {
  if (this.isModified('passwordInfo.password')) {
    const password = this.passwordInfo.password
    const cost = env.PASSWORD_COST_FACTOR

    const hash = await bcrypt.hash(password, cost)
    this.passwordInfo.password = hash
    this.passwordInfo.updatedAt = new Date()
  }

  next()
})

/**
 * Verify that the given password matches the stored one.
 */
userSchema.methods.verifyPassword = async function (this: IUserDocument, password: string) {
    const cost = env.PASSWORD_COST_FACTOR
    const hash = await bcrypt.hash(password, cost)
    return hash === this.passwordInfo.password
}

/**
 * Decode a token WITHOUT verifying it.
 */
userSchema.statics.decodeToken = function (this: UserModel, token: string) {
  return tokens.decode(token)
}

/**
 * Create an access token for this user.
 */
userSchema.methods.accessToken = function (this: IUserDocument) {
  return tokens.sign(this._id.toHexString())
}

/**
 * Verify that an access token is valid.
 */
userSchema.methods.verifyToken = async function (this: IUserDocument, token: string) {
  try {
    const decoded = await tokens.verify(token)
    // Sanity check that the token subject matches this user's id.
    return decoded.sub === this._id.toHexString()
  } catch (e) {
    return false
  }
}

/**
 * Return true if the user has the given role.
 */
userSchema.methods.hasRole = function (this: IUserDocument, role: string) {
  return this.roles.includes(role)
}

export const User = <UserModel>mongoose.model<IUserDocument>('User', userSchema)
