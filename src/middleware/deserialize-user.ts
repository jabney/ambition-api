import { Types } from 'mongoose'
import { RequestHandler } from 'express'
import { createError } from '../lib/errors'
import { User, IUserDocument } from '../models/user.model'
import { Token, ITokenDocument } from '../models/token.model'
import * as tokens from '../lib/tokens'
import getBearer from '../lib/get-bearer'

declare global {
  namespace Express {
    interface Request {
      token: ITokenDocument
      user: IUserDocument
    }
  }
}

export const defaultFields = 'email roles grants'

/**
 * Validate a token and use it to deserialize a user from the db. Both a
 * token and a user will be added to the `Request` object as `req.token`
 * and `req.user` unless the `optional` flag is `true`.
 *
 * @param optional a token is not required to fulfill this request
 * @param userFields a space-delimited list of fields to return for the user.
 * This is a mongoose fields projection value.
 *
 * If `optional` is specified, don't fail the request if the token is
 * invalid or not provided.
 */
export default function deserializeUser(
  optional: boolean = false,
  userFields: string|object|null = defaultFields,
): RequestHandler {

  return async (req, res, next) => {
    const token = getBearer(req)

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
    const userDoc = await User.findById(userId, userFields)

    if (userDoc == null) {
      if (optional) {
        return next()
      } else {
        return next(createError(401))
      }
    }

    const { jti: tokenId } = decoded
    const tokenDoc = await Token.findById(tokenId)

    if (tokenDoc == null) {
      if (optional) {
        return next()
      } else {
        return next(createError(401))
      }
    }

    req.token = tokenDoc
    req.user = userDoc

    next()
  }
}

export const tokenRequired = deserializeUser.bind(null, false)
export const tokenOptional = deserializeUser.bind(null, true)
