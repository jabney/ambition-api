import { RequestHandler } from 'express'
import { createError } from '../lib/errors'
import { isValidGrant } from '../config/grants'

/**
 * Allow request if the user has the given grant.
 *
 * This middleware requires the user to be deserialized with 'grants'.
 */
export function grantsPermission(grant: string): RequestHandler {
  if (!isValidGrant(grant)) {
    throw new Error(`<grantsPermission> grant "${grant}" is not valid`)
  }

  return (req, res, next) => {
    const user = req.user

    if (!user || !user.grants) {
      return next(createError(500, 'user grants unavailable'))
    }

    if (user.grantsPermission(grant)) {
      next()
    } else {
      next(createError(403))
    }
  }
}

export default grantsPermission
