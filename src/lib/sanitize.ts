/**
 * Sanitize body, query, and params objects on a Request.
 *
 * This process replaces the entire object with the specified fields.
 *
 * ```
 * const request = {
 *   body: {
 *     id: 1234,
 *     first: 'Jimmy',
 *     last: 'Jimmerton',
 *     someOtherField: {...}
 *   }
 * }
 *
 * // ...
 *
 * // Specify which fields to copy to the new body object.
 * router.post('/signin', sanitize(['email', 'password']), handler)
 *
 * // or
 *
 * // Specify fields with one or more sanitizers.
 * router.post('/signin', sanitize([{ first: 'toString', last: ['toString', '...'] }), handler)
 *
 * // ...
 *
 * const handler = async (req, res, next) => {
 *   const user = req.body
 *   await User.findOneAndUpdate({ _id: user.id }, user)
 * }
 * ```
 */
import { RequestHandler } from 'express'

type KeyVals<T=any> = {[key: string]: T}

type SanitizeName = 'toString'|'trim'|'toInt'|'toNum'|'noEmpty'|'noNull'

/**
 * Call a function with the given value if the value is defined.
 */
function callIfDefined(value: any, fn: (arg: any) => any) {
  return value === undefined ? value : fn(value)
}

/**
 * Value sanitizers by name.
 */
const sanitizers: {[K in SanitizeName]: (arg: any) => any} = {
  toString: (arg: any) => callIfDefined(arg, v => v.toString()),
  trim: (arg: any) => callIfDefined(arg, v => v.trim()),
  toInt: (arg: string) => callIfDefined(arg, v => parseInt(v)),
  toNum: (arg: string) => callIfDefined(arg, v => parseFloat(v)),
  noEmpty: (arg: string) => callIfDefined(arg, v => v.length === 0 ? undefined : v),
  noNull: (arg: string) => callIfDefined(arg, v => v === null ? undefined : v),
}

/**
 * Sanitizer not found.
 */
const sanitizerError = () => { throw new Error(`"${name}" is not a valid sanitizer`)}

/**
 * Get a sanitizer by name.
 */
const getSanitizer = (name: SanitizeName) => sanitizers[name] || sanitizerError

/**
 * Sanitize request body, query, or params.
 */
type SanitizeType = 'body'|'query'|'params'
/**
 * A map of { field => sanitizer_by_name }
 */
type SanitizeSpec = {[field: string]: SanitizeName|SanitizeName[]}
/**
 * Fields may be strings or objects containing one or more key/value pairs.
 */
type FieldSpec = string|SanitizeSpec

/**
 * Apply a sanitizer spec { field => sanitizer_by_name } to a target.
 */
function applySanitizers(source: KeyVals, target: KeyVals, spec: SanitizeSpec) {
  return Object.entries(spec).reduce((map, [key, fnName]) => {
    const value = source[key]
    if (Array.isArray(fnName)) {
      // For one or more sanitizers, apply them sequentially.
      const result = fnName.reduce((v, name) => getSanitizer(name)(v), value)
      // Ignore undefined results.
      if (result !== undefined) {
        map[key] = result
      }
    } else {
      // Get the result of the specified sanitizer.
      const sanitizer = getSanitizer(fnName)
      const result = sanitizer(value)
      // Ignore undefined results.
      if (result !== undefined) {
        map[key] = result
      }
    }
    return map
  }, target)
}

/**
 * Copy specified fields from the source to a new target.
 */
function copyFields(source: KeyVals, fields: FieldSpec[]) {
  return fields.reduce((target, field) => {
    if (typeof field === 'string') {
      // Copy the field from the source to the target.
      const value = source[field]
      // Ignore undefined values.
      if (value !== undefined) {
        target[field] = value
      }
      return target
    } else {
      // The field is a spec (object).
      return applySanitizers(source, target, field)
    }
  }, {} as KeyVals)
}

/**
 * Sanitize a request object's body, query, or params.
 *
 * This middleware replaces the entire sub object by copying only the
 * specified fields.
 */
export function sanitize(type: SanitizeType, fields: FieldSpec[]): RequestHandler {
  return (req, res, next) => {
    req[type] = copyFields(req[type], fields)
    next()
  }
}

export default sanitize
