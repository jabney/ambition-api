/**
 * Grants are permissions items that the user must explicitly grant.
 */
export type GrantType = 'track-location'

export interface IGrantItem {
  type: GrantType
  description: string
}

const grantItems: IGrantItem[] = [
  {
    type: 'track-location',
    description: 'allow location data to be gathered and stored',
  },
]

// Create a set of grant types (type only, no description).
const grantTypes: ReadonlySet<GrantType> = new Set(grantItems.map(({ type }) => type))

/**
 * Test the validity of a grant type.
 */
export function isValidGrant(type: GrantType) {
  return grantTypes.has(type)
}

// Export a copy of the grant items.
export const grantList: IGrantItem[] = grantItems.map(item => ({ ...item }))

// Export a list of grant types.
export const grants: GrantType[] = grantList.map(({ type }) => type)
