
export const authHeader = (token: string): [string, string] => {
  return ['Authorization', `Bearer ${token}`]
}
