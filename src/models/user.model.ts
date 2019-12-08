import mongoose, { Document, Schema, Types } from 'mongoose'
import { IUser } from './user.interface'
import schemaOptions from '../config/schema-options'
import env from '../environment'
import bcrypt from 'bcrypt'
import * as tokens from '../lib/tokens'

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId
  hasRole: (role: string) => boolean
  verifyPassword: (password: string) => Promise<boolean>
}

type UserModel = mongoose.Model<IUserDocument> & {/* userSchema.statics */}

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
}, schemaOptions({ timestamps: true }))

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
userSchema.methods.verifyPassword = function (this: IUserDocument, password: string) {
    return bcrypt.compare(password, this.passwordInfo.password)
}

/**
 * Return true if the user has the given role.
 */
userSchema.methods.hasRole = function (this: IUserDocument, role: string) {
  return this.roles.includes(role)
}

// /**
//  *
//  */
// userSchema.statics.example = function (this: UserModel) {
//
// }

export const User = <UserModel>mongoose.model<IUserDocument>('User', userSchema)
