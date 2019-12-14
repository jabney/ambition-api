import { authSignup, authSignin, authSignout, authSignoutAll } from './helpers/auth'
import { users, userProfile, userCredentials } from './helpers/user-profile'
import { validToken, expectTokenCount } from './expect'
import { addToWhitelist } from './helpers/db-utils'
import { getToken } from './helpers/get-token'

describe('Auth Routes', () => {

  it ('refuses unwhitelisted emails', async () => {
    await authSignup(userProfile())
      .expect(403)
  })

  it('signs up a user', async () => {
    await addToWhitelist(users.rando.email)

    await authSignup(userProfile())
      .expect(200)
      .expect(validToken())
  })

  it('signs in a user', async () => {
    await addToWhitelist(users.rando.email)

    await authSignup(userProfile())
      .expect(200)

    await authSignin(userCredentials())
      .expect(200)
      .expect(validToken())
  })

  it('signs out a user', async () => {
    await addToWhitelist(users.rando.email)

    const token = await authSignup(userProfile())
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
    await addToWhitelist(users.rando.email)

    await authSignup(userProfile())
      .expect(200)

    await authSignin(userCredentials())
      .expect(200)

    const token = await authSignin(userCredentials())
      .expect(200)
      .then(expectTokenCount(3))
      .then(getToken)

    await authSignoutAll(token)
      .expect(200)
      .then(expectTokenCount(0))
  })
})
