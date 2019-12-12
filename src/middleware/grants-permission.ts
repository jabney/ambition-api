import { RequestHandler } from 'express'
import { GrantType, isValidGrant } from '../config/grants'
import { createError } from '../lib/errors'
import { expectUser } from './helpers/expect-user'

/**
 * Allow request if the user has the given grant.
 *
 * This middleware requires the user to be deserialized with 'grants'.
 */
export function grantsPermission(grant: GrantType): RequestHandler {
  if (!isValidGrant(grant)) {
    throw new Error(`<grantsPermission> grant "${grant}" is not valid`)
  }

  return expectUser(async (req, res, next) => {
    const user = req.user

    if (!Array.isArray(user.grants)) {
      return next(createError(500, 'user grants unavailable'))
    }

    if (await user.grantsPermission(grant)) {
      return next()
    }

    return next(createError(403, 'user has not granted permission for this operation'))
  })
}

export default grantsPermission
