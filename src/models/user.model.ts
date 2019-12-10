import bcrypt from 'bcrypt'
import mongoose, { Document, Schema, Types } from 'mongoose'
import { grants, GrantType, isValidGrant } from '../config/grants'
import { isValidRole, roles, RoleType } from '../config/roles'
import schemaOptions from '../config/schema-options'
import env from '../environment'
import { IUser } from './user.interface'

export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId
  hasRole: (role: string) => Promise<boolean>
  grantsPermission: (grant: string) => Promise<boolean>
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
  roles: { $type: [String], enum: roles },
  grants: { $type: [String], enum: grants },
  passwordInfo: { $type: passwordInfoSchema, required: true },
}, schemaOptions({ timestamps: true }))

// Unique email.
userSchema.index({ email: 1 }, { unique: true })

/**
 *
 */
userSchema.pre('save', async function(this: IUserDocument, next) {
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
userSchema.methods.verifyPassword = function(this: IUserDocument, password: string) {
    return bcrypt.compare(password, this.passwordInfo.password)
}

/**
 * Return true if the user has the given role.
 */
userSchema.methods.hasRole = async function(this: IUserDocument, role: RoleType) {
  const userRoles = this.roles.filter(isValidRole)

  if (userRoles.length !== this.roles.length) {
    this.roles = userRoles
    await this.save()
  }

  return this.roles.includes(role)
}

/**
 * Return true if the user has the given role.
 */
userSchema.methods.grantsPermission = async function(this: IUserDocument, grant: GrantType) {
  const grants = this.grants.filter(isValidGrant)

  if (grants.length !== this.grants.length) {
    this.grants = grants
    await this.save()
  }

  return this.grants.includes(grant)
}

// /**
//  *
//  */
// userSchema.statics.example = function (this: UserModel) {
//
// }

export const User = mongoose.model<IUserDocument>('User', userSchema) as UserModel
