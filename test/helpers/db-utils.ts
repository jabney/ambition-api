import { User, IUserDocument } from '../../src/models/user.model'
import { Token } from '../../src/models/token.model'
import { RoleType } from '../../src/config/roles'
import { GrantType } from '../../src/config/grants'
import { Config } from '../../src/models/config.model'
import { Whitelist } from '../../src/models/whitelist.model'

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
export const addToWhitelist = async (emails: readonly string[]) => {
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
export const countTokens = async (userId?: string) => {
  if (userId) {
    return Token.find({ userId })
  } else {
    return Token.find({})
  }
}
