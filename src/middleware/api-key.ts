import { RequestHandler } from 'express'
import { createError } from '../lib/errors'
import env from '../environment'

/**
 * Require an api key to be set in request header.
 */
export const apiKey: RequestHandler = (req, res, next): void => {
  const API_KEY = env.API_KEY
  /**
   * If the API_KEY environment variable is set, check it against
   * the apiKey header.
   */
  if (typeof API_KEY === 'string' && API_KEY.length > 0) {
    const authorization = req.get('authorization') || ''
    const authKey = authorization.replace(/Bearer +/i, '')

    if (API_KEY !== authKey) {
      return next(createError(401, 'invalid api key'))
    }
  }

  next()
}
