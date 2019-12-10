
export const grants = Object.freeze([
  'track-location',
])

const set = new Set(grants)

export function isValidGrant(grant: string) {
  return set.has(grant)
}

export default grants
