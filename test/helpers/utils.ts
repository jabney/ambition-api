import env from '../../src/environment'

export const authHeader = (token: string): [string, string] => {
  return ['Authorization', `Bearer ${token}`]
}

export const apiKeyHeader = (): [string, string] => {
  return ['Authorization', `Bearer ${env.API_KEY}`]
}
