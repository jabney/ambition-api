/**
 * Define user roles.
 */
export type RoleType = 'super'|'admin'

export const roles: ReadonlyArray<RoleType> = Object.freeze([
  'super',
  'admin',
])

const set: ReadonlySet<RoleType> = new Set(roles)

export function isValidRole(role: RoleType) {
  return set.has(role)
}

export default roles
