import assert from 'assert'
import { Response } from 'supertest'
import { decode as decodeToken } from '../src/lib/tokens'
import env from '../src/environment'
import { countTokens, fetchProfileById } from './helpers/db'

/**
 * Expect a valid token.
 */
export const validToken = () => (res: Response) => {
  const { token } = res.body
  assert.strictEqual(typeof token, 'string', 'token is a string')

  const { iss: issuer, aud: audience } = decodeToken(token)
  assert.strictEqual(issuer, env.JWT_ISSUER, `expected ${env.JWT_ISSUER} tokens but found ${issuer}`)
  assert.strictEqual(audience, env.JWT_AUDIENCE, `expected ${env.JWT_AUDIENCE} tokens but found ${audience}`)
  return res
}

/**
 * Expect a number of tokens to be in the Tokens collection.
 */
export const expectTokenCount = (expected: number, query: any = {}) => {
  return async (res: Response) => {
    const actual = await countTokens(query)
    assert.strictEqual(actual, expected, `expected ${expected} tokens but found ${actual}`)
    return res
  }
}

/**
 * Expect given profile values on the user specfied by the response token.
 */
export const expectProfile = (profile: any) => {
  return async (res: Response) => {
    const { token } = res.body
    const { sub: userId } = decodeToken(token)
    const user = await fetchProfileById(userId)

    Object.entries(profile).forEach(([key, expected]) => {
      const actual = (user as any)[key]
      assert.strictEqual(actual, expected, `expected "${actual}" to equal "${expected}" for key "${key}"`)
    })
  }
}
