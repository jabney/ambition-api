import { RequestHandler } from 'express'
import { createError } from '../lib/errors'
import getBearer from '../lib/get-bearer'
import * as tokens from '../lib/tokens'
import { ITokenDocument, Token } from '../models/token.model'
import { IUserDocument, User } from '../models/user.model'

declare global {
  namespace Express {
    /* tslint:disable-next-line */
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
 * and `req.user`; however for cases where the token is not required, the
 * token will not be present on the request. If `user` is `false`, the user
 * will not be on the request object.
 *
 * @param requireToken a token is required to fulfill this request.
 * @param user if a string or an object, consider this argument to be a
 * mongoose projection. If `null`, return all fields for the user. If `false`,
 * don't deserialize the user on the request object.
 */
export function authorize(
  requireToken: boolean = false,
  user: string|object|null|false = defaultFields,
): RequestHandler {

  return async (req, res, next) => {
    const token = getBearer(req)

    if (!token) {
      if (requireToken) {
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
      if (requireToken) {
        return next(createError(401))
      } else {
        return next()
      }
    }

    const { jti: tokenId } = decoded
    const tokenDoc = await Token.findById(tokenId)

    if (tokenDoc == null) {
      if (requireToken) {
        return next(createError(401))
      } else {
        return next()
      }
    }

    req.token = tokenDoc

    const { sub: userId } = decoded
    const projection = user === false ? '_id' : user
    const lean = user === false
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

export const tokenRequired = authorize(true, false)
export const tokenOptional = authorize(false, false)

export const deserializeUser = authorize.bind(null, true)
