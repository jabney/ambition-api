import { authSignup, authSignin, authSignout, authSignoutAll } from './helpers/auth'
import { signupInfo, signinCredentials } from './helpers/user-profile'
import { validToken, expectTokenCount, expectProfile } from './expect'
import { autoWhitelist } from './helpers/db'
import { getToken } from './helpers/get-token'

describe('Auth Routes', () => {

  it('fails signup on missing api key', async () => {
    await autoWhitelist()

    await authSignup(signupInfo(), false)
      .expect(401)
  })

  it('fails signup on bad info', async () => {
    await authSignup({ email: '', password: 'asdf' })
      .expect(422)

    await authSignup({ email: 'someone@example.com', password: '' })
      .expect(422)
  })

  it('refuses unwhitelisted emails', async () => {
    await authSignup(signupInfo())
      .expect(403)
  })

  it('signs up a user', async () => {
    await autoWhitelist()

    await authSignup(signupInfo())
      .expect(200)
      .expect(validToken())

    // Try to sign up the same user again.
    await authSignup(signupInfo())
      .expect(409)
  })

  it('correctly sets profile info', async () => {
    await autoWhitelist()

    // Sign up with full profile info.
    await authSignup(signupInfo())
      .expect(200)
      .then(expectProfile({ first: 'Rando', last: 'Calrissian' }))

    // Sign up with only email/passwrod.
    await authSignup(signinCredentials('jabroni'))
      .expect(200)
      .then(expectProfile({ first: undefined, last: undefined }))
  })

  it('signs in a user', async () => {
    await autoWhitelist()

    await authSignup(signupInfo())
      .expect(200)

    await authSignin(signinCredentials())
      .expect(200)
      .expect(validToken())
  })

  it('signs out a user', async () => {
    await autoWhitelist()

    const token = await authSignup(signupInfo())
      .expect(200)
      .then(getToken)

    await authSignout(token)
      .expect(200)

    // Our token should be invalid...
    await authSignout(token)
      .expect(401)
      // ...and all tokens should be removed.
      .then(expectTokenCount(0))
  })

  it('revokes all tokens for a user', async () => {
    await autoWhitelist()

    // Sign up a user.
    await authSignup(signupInfo('rando'))
      .expect(200)

    // Sign up a different user.
    await authSignup(signupInfo('jabroni'))
      .expect(200)

    // Sign in (2 tokens for this user now).
    await authSignin(signinCredentials('rando'))
      .expect(200)

    // Sign in (2 tokens for this user now).
    const token = await authSignin(signinCredentials('jabroni'))
      .expect(200)
      .then(expectTokenCount(4))
      .then(getToken)

    // Removes 2 tokens, leaves the other two.
    await authSignoutAll(token)
      .expect(200)
      .then(expectTokenCount(2))
  })
})
