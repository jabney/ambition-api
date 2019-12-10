
export const roles = Object.freeze([
  'super',
  'admin',
])

const set = new Set(roles)

export function isValidRole(role: string) {
  return set.has(role)
}

export default roles
