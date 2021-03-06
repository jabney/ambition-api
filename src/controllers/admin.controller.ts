import { RequestHandler } from 'express'
import { createError } from '../lib/errors'
import { Whitelist } from '../models/whitelist.model'
import { Token } from '../models/token.model'
import { User } from '../models/user.model'

/*****************************************************************
 * Whitelist
 */

/**
 * Return the application whitelist (email addresses allowed to sign up).
 */
export const fetchWhitelist: RequestHandler = async (req, res, next) => {
  try {
    const whitelist = await Whitelist.allowed()

    res.json({ whitelist })

  } catch (e) {
    next(createError(e))
  }
}

/**
 * Add a user to the whitelist.
 */
export const addToWhitelist: RequestHandler = async (req, res, next) => {
  const { email } = req.body

  try {
    await Whitelist.addToWhitelist(email)

    res.json({ data: 'email added' })

  } catch (e) {
    return next(createError(e))
  }
}

/**
 * Remove a user from the whitelist.
 */
export const removeFromWhitelist: RequestHandler = async (req, res, next) => {
  const { email } = req.body

  try {
    await Whitelist.removeFromWhitelist(email)

    res.json({ data: 'email removed' })

  } catch (e) {
    return next(createError(e))
  }
}

/*****************************************************************
 * Users
 */

/**
 * Fetch a list of users.
 */
export const fetchUsers: RequestHandler = async  (req, res, next) => {
  const { limit = 20, skip = 0, sortBy = 'last first' } = req.query

  try {
    const users = await User.find({})
      .select('email first last roles')
      .skip(skip)
      .limit(limit)
      .sort(sortBy)

    res.json({ users })

  } catch (e) {
    return next(createError(e))
  }
}

/**
 * Delete a user and associated data.
 */
export const deleteUser: RequestHandler = async (req, res, next) => {
  const { userId, confirm } = req.body

  try {
    const userDoc = await User.findById(userId)

    if (userDoc == null) {
      return next(createError(404, 'user not found'))
    }

    if (userDoc.hasRole('super')) {
      return next(createError(400, 'cannot delete a super user'))
    }

    if (userDoc.hasRole('admin')) {
      return next(createError(400, 'cannot delete an admin user'))
    }

    if (confirm !== true) {
      return next(createError(400, 'could not confirm delete user'))
    }

    await Token.deleteMany({ userId })
    await userDoc.remove()

    res.json({ data: `user "${userId}" and associated data removed`})

  } catch (e) {
    return next(createError(e))
  }
}

/**
 * Add a role to a user.
 */
export const addUserRole: RequestHandler = async (req, res, next) => {
  const user = req.user
  const { userId, role } = req.body

  // The 'super' role cannot be granted by anyone, ever.
  if (role === 'super') {
    return next(createError(403, 'cannot grant super role'))
  }

  // Current user has 'super' role.
  const isSuper = await user.hasRole('super')

  // Only a 'super' can grant admin role.
  if (role === 'admin') {
    // Make sure the current user is super.
    if (!isSuper) {
      return next(createError(403, 'cannot grant admin role'))
    }
  }

  try {
    const targetUser = await User.findById(userId)

    if (targetUser == null) {
      return next(createError(404, 'user not found'))
    }

    // Nobody can modify a super user.
    if (await targetUser.hasRole('super')) {
      return next(createError(400, 'cannot modify a super user'))
    }

    // Only a super user can modify an admin.
    if (await targetUser.hasRole('admin') && !isSuper) {
      return next(createError(403, 'cannot modify admin user'))
    }

    // Add the role.
    await User.findByIdAndUpdate(userId, { $addToSet: { roles: role }}, {
      runValidators: true,
    })

    res.json({ data: `role "${role}" added` })

  } catch (e) {
    return next(createError(e))
  }
}

/**
 * Remove a role from a user.
 */
export const removeUserRole: RequestHandler = async (req, res, next) => {
  const user = req.user
  const { userId, role } = req.body

  // The 'super' role cannot be revoked by anyone, ever.
  if (role === 'super') {
    return next(createError(403, 'cannot revoke super role'))
  }

  // Current user has 'super' role.
  const isSuper = await user.hasRole('super')

  // Only a 'super' can revoke admin role.
  if (role === 'admin') {
    // Make sure the current user is super.
    if (!isSuper) {
      return next(createError(403, 'cannot revoke admin role'))
    }
  }

  try {
    const targetUser = await User.findById(userId)

    if (targetUser == null) {
      return next(createError(404, 'user not found'))
    }

    // Nobody can modify a super user.
    if (await targetUser.hasRole('super')) {
      return next(createError(400, 'cannot modify a super user'))
    }

    // Only a super user can modify an admin.
    if (await targetUser.hasRole('admin') && !isSuper) {
      return next(createError(403, 'cannot modify admin user'))
    }

    // Remove the role.
    await User.findByIdAndUpdate(userId, { $pull: { roles: role } })

    res.json({ data: `role "${role}" removed` })

  } catch (e) {
    return next(createError(e))
  }
}

/*****************************************************************
 * Tokens
 */

/**
 * Delete all access tokens for a given user.
 */
export const revokeTokens: RequestHandler = async (req, res, next) => {
  const { userId, email } = req.body

  try {
    // Delete all tokens associated with a user id.
    if (userId) {
      const result = await Token.deleteMany({ userId })

      return res.json({ data: `deleted ${result.deletedCount} tokens for user "${userId}"`})

    // Delete a token by user email.
    } else if (email) {
      const user = await User.findOne({ email }, '_id email', { lean: true })

      if (user == null) {
        return next(createError(404, 'user not found'))
      }

      const result = await Token.deleteMany({ userId: user._id })

      return res.json({ data: `deleted ${result.deletedCount} tokens for user "${user.email}"`})
    }

    return next(createError(400, 'no action performed'))

  } catch (e) {
    return next(createError(e))
  }
}

/**
 * Delete all access tokens in the tokens collection.
 */
export const revokeAllTokens: RequestHandler = async (req, res, next) => {
  const { confirm } = req.body

  try {
    if (confirm !== true)  {
      return next(createError(400, 'could not confirm delete all tokens'))
    }

    const result = await Token.deleteMany({})

    return res.json({ data: `deleted ${result.deletedCount} tokens`})

  } catch (e) {
    return next(createError(e))
  }
}
