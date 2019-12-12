import { RequestHandler } from 'express'
import { createError } from '../../lib/errors'

/**
 * Respond with an error if the user object is not on the request.
 */
export function expectUser(handler: RequestHandler): RequestHandler {
  return (req, res, next) => {
    const user = req.user

    if (user == null) {
      return next(createError(500, 'expected to find a user on the request object'))
    }

    handler(req, res, next)
  }
}
