export type GrantType = 'track-location'

export const grants: ReadonlyArray<GrantType> = Object.freeze([
  'track-location',
])

const set: ReadonlySet<GrantType> = new Set(grants)

export function isValidGrant(grant: GrantType) {
  return set.has(grant)
}

export default grants
