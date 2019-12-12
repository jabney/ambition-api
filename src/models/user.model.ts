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
const userSchema = new Schema({
  email: { $type: String, required: true },
  first: String,
  last: String,
  roles: { $type: [String], enum: roles },
  grants: { $type: [String], enum: grants },
  settings: { $type: String, default: '{}' },
  passwordInfo: { $type: passwordInfoSchema, required: true },
}, schemaOptions({ timestamps: true }))

// Unique email.
userSchema.index({ email: 1 }, { unique: true })

/**
 * Update the password if it has been modified.
 */
userSchema.pre('save', async function(this: IUserDocument) {
  if (this.isModified('passwordInfo.password')) {
    const password = this.passwordInfo.password
    const cost = env.PASSWORD_COST_FACTOR

    const hash = await bcrypt.hash(password, cost)
    this.passwordInfo.password = hash
    this.passwordInfo.updatedAt = new Date()
  }
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

  /**
   * Remove any invalid roles from the user object.
   */
  if (userRoles.length !== this.roles.length) {
    this.roles = userRoles
    await this.save()
  }

  return userRoles.includes(role)
}

/**
 * Return true if the user has the given grant.
 */
userSchema.methods.grantsPermission = async function(this: IUserDocument, grant: GrantType) {
  const userGrants = this.grants.filter(isValidGrant)

  /**
   * Remove any invalid grants from the user object.
   */
  if (userGrants.length !== this.grants.length) {
    this.grants = userGrants
    await this.save()
  }

  return userGrants.includes(grant)
}

// /**
//  *
//  */
// userSchema.statics.example = function (this: UserModel) {
//
// }

export const User = mongoose.model<IUserDocument>('User', userSchema) as UserModel
