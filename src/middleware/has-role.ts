import { RequestHandler } from 'express'
import { createError } from '../lib/errors'

/**
 * Allow request if the user has the given role.
 *
 * This middleware requires the user to be deserialized with 'roles'.
 */
export function hasRole(role: string): RequestHandler {
  return (req, res, next) => {
    const user = req.user

    if (!user || !user.roles) {
      return next(createError(500, 'user roles unavailable'))
    }

    if (user.roles.includes(role)) {
      next()
    } else {
      next(createError(403))
    }
  }
}

export default hasRole
