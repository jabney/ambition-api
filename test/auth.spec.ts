import { signupUser, signinUser } from './helpers/auth'
import { userEmails, userProfile, userCredentials } from './helpers/user-profile'
import { expectToken } from './expect'
import { addToWhitelist } from './helpers/db-utils'

describe('Auth Routes', () => {

  it('signs up a user', async () => {
    await addToWhitelist(userEmails)
    await signupUser(userProfile())
      .expect(200)
      .expect(expectToken())
  })

  it('signs in a user', async () => {
    await addToWhitelist(userEmails)
    await signupUser(userProfile())
      .expect(200)

    await signinUser(userCredentials())
      .expect(200)
      .expect(expectToken())
  })
})
