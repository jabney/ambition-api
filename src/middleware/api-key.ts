import { RequestHandler } from 'express'
import env from '../environment'
import { createError } from '../lib/errors'
import getBearer from '../lib/get-bearer'

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
    const authKey = getBearer(req)

    if (API_KEY !== authKey) {
      return next(createError(401, 'invalid api key'))
    }
  }

  next()
}
