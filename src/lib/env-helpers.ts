
/**
 * Convert a string to a boolean.
 */
export function booleanize(value: string|undefined, compare = 'true') {
  if (value == null) {
    return false
  }

  return value.trim().toLowerCase() === compare.trim().toLowerCase()
}
