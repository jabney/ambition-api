import assert from 'assert'
import { signupUser, signinUser, signoutUser } from './helpers/auth'
import { userEmails, userProfile, userCredentials } from './helpers/user-profile'
import { validToken, expectTokenCount } from './expect'
import { addToWhitelist, countTokens } from './helpers/db-utils'
import { getToken } from './helpers/get-token'

describe('Auth Routes', () => {

  it ('refuses unwhitelisted emails', async () => {
    await signupUser(userProfile())
      .expect(403)
  })

  it('signs up a user', async () => {
    await addToWhitelist(userEmails)

    await signupUser(userProfile())
      .expect(200)
      .expect(validToken())
  })

  it('signs in a user', async () => {
    await addToWhitelist(userEmails)

    await signupUser(userProfile())
      .expect(200)

    await signinUser(userCredentials())
      .expect(200)
      .expect(validToken())
  })

  it('signs out a user', async () => {
    await addToWhitelist(userEmails)

    const token = await signupUser(userProfile())
      .expect(200)
      .then(getToken)

    await signoutUser(token)
      .expect(200)

    // Our token should be invalid...
    await signoutUser(token)
      .expect(401)
      // ...and all tokens should be removed.
      .then(expectTokenCount(0))
  })
})
