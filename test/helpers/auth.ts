import request from 'supertest'
import app from '../../src/app'
import { IProfileInfo } from '../../src/models/profile-info.interface'
import { authHeader, apiKeyHeader } from './utils'

/**
 *
 */
export function authSignup(profile: IProfileInfo, apiKey = true) {
  const req = request(app)
    .post('/auth/signup')

  if (apiKey) {
    req.set(...apiKeyHeader())
  }

  return req.send(profile)
}

/**
 *
 */
export function authSignin(credentials: IProfileInfo, token?: string) {
  const req = request(app)
    .post('/auth/signin')
    .set(...apiKeyHeader())

  if (token) {
    req.set(...authHeader(token))
  }

  return req.send(credentials)
}

/**
 *
 */
export function authSignout(token: string) {
  return request(app)
    .get('/auth/signout')
    .set(...authHeader(token))
}

/**
 *
 */
export function authSignoutAll(token: string) {
  return request(app)
    .get('/auth/signout/all')
    .set(...authHeader(token))
}
