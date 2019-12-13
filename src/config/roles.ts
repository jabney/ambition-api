/**
 * Define user roles.
 */
export type RoleType = 'super'|'admin'|'lead'

export const roles: ReadonlyArray<RoleType> = Object.freeze([
  'super',
  'admin',
  'lead',
])

const set: ReadonlySet<RoleType> = new Set(roles)

/**
 * Return true if the role is valid.
 */
export function isValidRole(role: RoleType) {
  return set.has(role)
}

/**
 * Throw an error if the role is not valid.
 */
export function validateRole(role: RoleType) {
  if (!isValidRole(role)) {
    throw new Error(`role "${role}" is not a valid role`)
  }
}

/**
 * Return the one-based rank of a role.
 */
export function roleRank(role: RoleType) {
  validateRole(role)

  const index = roles.indexOf(role)
  return index + 1
}

export default [...roles]
