import mongoose, { Document, Schema, SchemaTypes } from 'mongoose'
import { IUser } from './user.interface'
import schemaOptions from '../config/schema-options'
import env from '../environment'
import bcrypt from 'bcrypt'
import * as tokens from '../lib/tokens'

export interface IUserDocument extends IUser, Document {}

type UserModel = mongoose.Model<IUserDocument> & { /* userSchema.statics */}

/**
 * Define the schema for a user's password info object.
 */
const passwordInfoSchema = new Schema({
  password: { $type: String, required: true },
  updatedAt: { $type: Date, default: Date.now },
}, schemaOptions())

/**
 * Define the schema for a user record.
 */
export const userSchema = new Schema({
  email: { $type: String, required: true },
  first: String,
  last: String,
  roles: [String],
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

export const User = <UserModel>mongoose.model<IUserDocument>('User', userSchema)
