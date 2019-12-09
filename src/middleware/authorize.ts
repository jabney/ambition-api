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
 * @param tokenRequired a token is not required to fulfill this request
 * @param user a space-delimited list of fields to return for the user.
 * This is a mongoose fields projection value.
 *
 * If `optional` is specified, don't fail the request if the token is
 * invalid or not provided.
 */
export function authorize(
  tokenRequired: boolean = false,
  user: string|object|null|false = defaultFields,
): RequestHandler {

  return async (req, res, next) => {
    const token = getBearer(req)

    if (!token) {
      if (tokenRequired) {
        return next(createError(401))
      } else {
        return next()
      }
    }

    let decoded: tokens.IToken

    try {
      // Check that the token is valid.
      decoded = await tokens.verify(token)
    } catch (e) {
      if (tokenRequired) {
        return next(createError(401))
      } else {
        return next()
      }
    }

    const { jti: tokenId } = decoded
    const tokenDoc = await Token.findById(tokenId)

    if (tokenDoc == null) {
      if (tokenRequired) {
        return next(createError(401))
      } else {
        return next()
      }
    }

    req.token = tokenDoc

    const { sub: userId } = decoded
    const projection = user === false ? '_id' : user
    const lean = user !== false
    const userDoc = await User.findById(userId, projection, { lean })

    /**
     * If there is no user associated with the token, then
     * consider the token as invalid.
     */
    if (userDoc == null) {
      return next(createError(401))
    }

    if (user !== false) {
      req.user = userDoc
    }

    next()
  }
}

export default authorize

export const tokenRequired = authorize.bind(null, false)
export const tokenOptional = authorize.bind(null, true)
