import assert from 'assert'
import { Response } from 'supertest'
import { decode as decodeToken } from '../src/lib/tokens'
import env from '../src/environment'

export const expectToken = () => {
  return (res: Response) => {
    const { token } = res.body
    assert.strictEqual(typeof token, 'string', 'token is a string')

    const { iss: issuer, aud: audience } = decodeToken(token)
    assert.strictEqual(issuer, env.JWT_ISSUER, 'issuer is present')
    assert.strictEqual(audience, env.JWT_AUDIENCE, 'audience is present')
  }
}
