/**
 * A helper library for this app's json web tokens.
 */
import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
import env from '../environment'
import { timeSec } from './time'

/**
 * The contents of a decoded token.
 */
export interface IToken {
  iss: string
  aud: string
  sub: string
  jti: string
  iat: number
  exp: number
}

/**
 * The token payload.
 */
interface ICreatePayload {
  iss: string
  aud: string
  sub: string
  jti: string
}

/**
 * Create and return a token.
 */
export function sign(userId: string): Promise<string> {
  const payload: ICreatePayload = {
    iss: env.JWT_ISSUER,
    aud: env.JWT_AUDIENCE,
    sub: userId,
    jti: new Types.ObjectId().toHexString(),
  }

  const options: jwt.SignOptions = {
    algorithm: 'HS256',
    expiresIn: timeSec({ days: env.JWT_EXPIRES_IN_DAYS }),
  }

  return new Promise((resolve, reject) => {
    jwt.sign(payload, env.JWT_SECRET, options, (err, token) => {
      if (err) { return reject(err) }
      resolve(token)
    })
  })
}

/**
 * Decode a token WITHOUT verifying.
 */
export function decode(token: string): IToken {
  return jwt.decode(token) as IToken
}

/**
 * Verify a token.
 */
export function verify(token: string): Promise<IToken> {
  const options: jwt.VerifyOptions = {
    issuer: env.JWT_ISSUER,
    audience: env.JWT_AUDIENCE,
  }

  return new Promise((resolve, reject) => {
    jwt.verify(token, env.JWT_SECRET, options, (err, decoded) => {
      if (err) { return reject(err) }
      resolve(decoded as IToken)
    })
  })
}
