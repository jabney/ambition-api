import { IUser } from '../../src/models/user.interface'
import { User, IUserDocument } from '../../src/models/user.model'
import { Token } from '../../src/models/token.model'
import { RoleType } from '../../src/config/roles'
import { GrantType } from '../../src/config/grants'
import { Config } from '../../src/models/config.model'
import { Whitelist } from '../../src/models/whitelist.model'
import { users } from './user-profile'

/**
 *
 */
export const deleteTestData = async () => {
  await Config.deleteMany({})
  await User.deleteMany({})
  await Token.deleteMany({})
}

/**
 *
 */
export async function fetchProfileById(userId: string): Promise<IUser> {
  const user = await User.findById(userId)
  return (user as IUserDocument).toJSON()
}

/**
 *
 */
export const autoWhitelist = async () => {
const emails = Object.values(users).map(user => user.email)

for (const email of emails) {
    await Whitelist.updateOne({}, { $push: { allowed: email } }, { upsert: true })
  }
}

/**
 *
 */
export const addRole = async (user: IUserDocument, role: RoleType) => {
  const userDoc = User.findByIdAndUpdate(user._id, { $addToSet: { roles: role }}, {
    runValidators: true,
    new: true,
  })
  return userDoc
}

/**
 *
 */
export const removeRole = async (user: IUserDocument, role: RoleType) => {
  const userDoc = User.findByIdAndUpdate(user._id, { $pull: { roles: role }}, {
    new: true,
  })
  return userDoc
}

/**
 *
 */
export const addGrant = async (user: IUserDocument, grant: GrantType) => {
  const userDoc = User.findByIdAndUpdate(user._id, { $addToSet: { grants: grant }}, {
    runValidators: true,
    new: true,
  })
  return userDoc
}

/**
 *
 */
export const removeGrant = async (user: IUserDocument, grant: GrantType) => {
  const userDoc = User.findByIdAndUpdate(user._id, { $pull: { grants: grant }}, {
    new: true,
  })
  return userDoc
}

/**
 *
 */
export const countTokens = async (query: any = {}) => {
  return await Token.countDocuments(query)
}
