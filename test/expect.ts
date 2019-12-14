import assert from 'assert'
import { Response } from 'supertest'
import { decode as decodeToken } from '../src/lib/tokens'
import env from '../src/environment'
import { countTokens } from './helpers/db-utils'

/**
 * Expect a valid token.
 */
export const validToken = () => (res: Response) => {
  const { token } = res.body
  assert.strictEqual(typeof token, 'string', 'token is a string')

  const { iss: issuer, aud: audience } = decodeToken(token)
  assert.strictEqual(issuer, env.JWT_ISSUER, 'issuer is present')
  assert.strictEqual(audience, env.JWT_AUDIENCE, 'audience is present')
}

/**
 * Expect a number of tokens to be in the Tokens collection.
 */
export const expectTokenCount = (expected: number, query: any = {}) => {
  return async (res: Response) => {
    const actual = await countTokens(query)
    assert.strictEqual(actual, expected, `expected ${expected} tokens but found ${actual}`)
  }
}
