import { Request } from 'express'

/**
 * Get a bearer token from the authorization header.
 */
export default function getBearer(req: Request) {
  const authorization = req.get('authorization') || ''
  return authorization.replace(/Bearer +/i, '')
}
