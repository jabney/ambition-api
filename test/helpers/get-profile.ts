import { Response } from 'supertest'
import { IUser } from '../../src/models/user.interface'
import { decode } from '../../src/lib/tokens'
import { fetchProfileById } from './db'

/**
 * Return the profile of the user specified by a response token.
 */
export const getProfile = async (res: Response): Promise<IUser> => {
  const { token } = res.body
  const { sub: userId } = decode(token)
  return fetchProfileById(userId)
}
