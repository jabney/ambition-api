import { Types } from 'mongoose'
import { RequestHandler } from 'express'
import { createError } from '../lib/errors'
import { User, IUserDocument } from '../models/user.model'
import { Token, ITokenDocument } from '../models/token.model'
import * as tokens from '../lib/tokens'

const { ObjectId } = Types

declare global {
  namespace Express {
    interface Request {
      token: ITokenDocument
      user: IUserDocument
    }
  }
}

export const defaultFields = Object.freeze(['email', 'roles', 'grants'])

/**
 * Validate a token and use it to deserialize a user from the db. Both a
 * token and a user will be added to the `Request` object as `req.token`
 * and `req.user` unless the `optional` flag is `true`.
 *
 * @param optional a token is not required to fulfill this request
 * @param userFields a list of fields to return for the user. See
 * `defaultFields` export for defaults.
 *
 * If `optional` is specified, don't fail the request if the token is
 * invalid or not provided.
 *
 * If `null` or an empty array is passed for `userFields`, all fields
 * will be returned for the user record.
 */
export default function deserializeUser(
  optional: boolean = false,
  userFields: ReadonlyArray<string>|null = defaultFields,
): RequestHandler {
  return async (req, res, next) => {
    const auth = req.get('authorization') || ''
    const token = auth.replace(/Bearer +/i, '').trim()

    if (!token) {
      if (optional) {
        return next()
      } else {
        return next(createError(401))
      }
    }

    let decoded: tokens.IToken

    try {
      // Check that the token is valid.
      decoded = await tokens.verify(token)
    } catch (e) {
      if (optional) {
        return next()
      } else {
        return next(createError(401))
      }
    }

    const { sub: userId } = decoded
    const fields = userFields || []
    const userDoc = await User.findById(userId, fields.join(' '))

    if (userDoc == null) {
      return next(createError(401))
    }

    const tokenDoc = await Token.findOne({ userId: new ObjectId(userId) })

    if (tokenDoc == null) {
      return next(createError(401))
    }

    req.token = tokenDoc
    req.user = userDoc

    next()
  }
}

export const tokenRequired = deserializeUser.bind(null, false)
export const tokenOptional = deserializeUser.bind(null, true)
