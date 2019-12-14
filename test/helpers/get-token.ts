import { Response } from 'supertest'

export const getToken = (res: Response) => {
  return res.body.token
}
