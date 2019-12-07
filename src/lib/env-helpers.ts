import crypto from 'crypto'

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

/**
 * Return a random string if value is undefined or zero length.
 */
export function getOrRandom(value: string|undefined, bytes = 16) {
  if (value == null || value.length === 0) {
    return crypto.randomBytes(bytes).toString('hex')
  }
  return value
}

/**
 * Get a non-zero-length string from the given key or throw an error.
 */
export function getOrThrow(key: string) {
  const value = process.env[key]

  if (value == null) {
    throw new Error(`environment veriable "${key}" not set`)
  }

  return value
}
