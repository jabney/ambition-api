
/**
 * Convert a string to a boolean.
 */
export function booleanize(value: string|undefined, compare = 'true') {
  if (value == null) {
    return false
  }

  return value.trim().toLowerCase() === compare.trim().toLowerCase()
}

/**
 * Convert a string to a number.
 */
export function integerize(value: string|undefined, onUndefined: number|'throw' = 'throw') {
  if (value == null) {
    if (onUndefined === 'throw') {
      throw new Error('<integerize> value is undefined')
    }
    return onUndefined
  }

  try {
    return parseInt(value)
  } catch (e) {
    throw new Error(`<integerize> cannot parse "${value}" as integer`)
  }
}
