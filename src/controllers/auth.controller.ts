import { RequestHandler } from 'express'
import { Token } from '../models/token.model'
import * as tokens from '../lib/tokens'

/**
 * Create a token and save it to the db.
 */
async function createToken(userId: string): Promise<string> {
  const token = await tokens.sign(userId)

  const {
    iat: issuedAt,
    exp: expiresAt,
  } = tokens.decode(token)

  const tokenDoc = new Token({ userId, issuedAt, expiresAt })
  await tokenDoc.save()
  return token
}

// createToken('5dec56e4e903e327da7fe5c9').then(token => console.log(token))

/**
 *
 */
export const signup: RequestHandler = (req, res, next) => {
  res.json({ data: 'signup' })
}

/**
 *
 */
export const signin: RequestHandler = (req, res, next) => {
  res.json({ data: 'signin' })
}

/**
 *
 */
export const signout: RequestHandler = (req, res, next) => {
  res.json({ data: 'signout' })
}

/**
 *
 */
export const signoutAll: RequestHandler = (req, res, next) => {
  res.json({ data: 'signoutAll' })
}
