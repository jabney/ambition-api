import { RequestHandler } from 'express'
import { isValidRole, RoleType } from '../config/roles'
import { createError } from '../lib/errors'
import { expectUser } from './helpers/expect-user'

/**
 * Allow request if the user has the given role.
 *
 * This middleware requires the user to be deserialized with 'roles'.
 */
export function hasRole(role: RoleType): RequestHandler {
  if (!isValidRole(role)) {
    throw new Error(`<hasRole> role "${role}" is not valid`)
  }

  return expectUser(async (req, res, next) => {
    const user = req.user

    if (!Array.isArray(user.roles)) {
      return next(createError(500, 'user roles unavailable'))
    }

    if (!await user.hasRole(role)) {
      return next(createError(403, 'user does not have required role'))
    }
  })
}

export default hasRole
