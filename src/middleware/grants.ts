import { RequestHandler } from 'express'
import { GrantType } from '../config/grants'
import { createError } from '../lib/errors'

/**
 * Allow request if the user has granted the permission.
 *
 * This middleware requires the user to be deserialized with 'grants'.
 */
export function grants(permission: GrantType): RequestHandler {
  return (req, res, next) => {
    const user = req.user

    if (!user || !user.grants) {
      return next(createError(500, 'user grants unavailable'))
    }

    if (user.grants.includes(permission)) {
      next()
    } else {
      next(createError(403))
    }
  }
}

export default grants
