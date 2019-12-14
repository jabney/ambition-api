import { Response } from 'supertest'

export const getToken = (res: Response): string => {
  return res.body.token
}
