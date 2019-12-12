import { RequestHandler } from 'express'
import { createError } from '../lib/errors'
import { Whitelist } from '../models/whitelist.model'
import { Token } from '../models/token.model'
import { User } from '../models/user.model'

/*****************************************************************
 * Whitelist
 */

/**
 *
 */
export const fetchWhitelist: RequestHandler = async (req, res, next) => {
  try {
    const doc = await Whitelist.findOne()
    const whitelist = doc && doc.allowed || []

    res.json({ whitelist })

  } catch (e) {
    next(createError(e))
  }
}

/**
 *
 */
export const addToWhtelist: RequestHandler = async (req, res, next) => {
  const { email } = req.body

  try {
    await Whitelist.updateOne({}, { $addToSet: { allowed: email }}, {
      upsert: true,
      runValidators: true,
    })

    res.json({ data: 'email added' })

  } catch (e) {
    return next(createError(e))
  }
}

/**
 *
 */
export const removeFromWhitelist: RequestHandler = async (req, res, next) => {
  const { email } = req.body

  try {
    await Whitelist.updateOne({}, { $pull: { allowed: email }}, { upsert: true })

    res.json({ data: 'email removed' })

  } catch (e) {
    return next(createError(e))
  }
}

/*****************************************************************
 * Tokens
 */

export const revokeTokens: RequestHandler = async (req, res, next) => {
  const { userId, email } = req.query

  try {
    // Delete all tokens associated with a user id.
    if (userId) {
      const result = await Token.deleteMany({ userId })

      if (result.deletedCount === 0) {
        return res.json({ data: `no tokens found for user with id "${userId}"`})
      }

      return res.json({ data: `deleted ${result.deletedCount} tokens for user "${userId}"`})

    // Delete a token by user email.
    } else if (email) {
      const user = await User.findOne({ email }, '_id email', { lean: true })

      if (user == null) {
        return next(createError(404, 'user not found'))
      }

      const result = await Token.deleteMany({ userId: user._id })

      if (result.deletedCount === 0) {
        return res.json({ data: `no tokens found for user with email "${user.email}"`})
      }

      return res.json({ data: `deleted ${result.deletedCount} tokens for user "${user.email}"`})
    }

    return next(createError(400, 'no action performed'))

  } catch (e) {
    return next(createError(e))
  }
}

export const revokeAllTokens: RequestHandler = async (req, res, next) => {
  const { confirm } = req.query

  try {
    if (!confirm)  {
      return next(createError(400, 'could not confirm delete all tokens'))
    }

    const result = await Token.deleteMany({})

    if (result.deletedCount === 0) {
      return res.json({ data: `no tokens found for deletion`})
    }

    return res.json({ data: `deleted all ${result.deletedCount} tokens`})

  } catch (e) {
    return next(createError(e))
  }
}
