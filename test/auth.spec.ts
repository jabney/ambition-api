import { signupUser, signinUser } from './helpers/auth'
import { userProfile, userCredentials } from './helpers/user-profile'
import { expectToken } from './expect'

describe('Auth Routes', () => {

  it('signs up a user', async () => {
    await signupUser(userProfile())
      .expect(200)
      .expect(expectToken())
  })

  it('signs in a user', async () => {
    await signupUser(userProfile())
      .expect(200)

    await signinUser(userCredentials())
      .expect(200)
      .expect(expectToken())
  })
})
