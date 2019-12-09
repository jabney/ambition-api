import { RequestHandler } from 'express'

type KeyVals<T=any> = {[key: string]: T}

type SanitizeName = 'toString'|'trim'|'toInt'|'toNum'|'noEmpty'|'noNull'

/**
 *
 */
function callIfDefined(value: any, fn: (arg: any) => any) {
  return value === undefined ? undefined : fn(value)
}

const sanitizers: {[K in SanitizeName]: (arg: any) => any} = {
  toString: (arg: any) => callIfDefined(arg, v => v.toString()),
  trim: (arg: any) => callIfDefined(arg, v => v.trim()),
  toInt: (arg: string) => callIfDefined(arg, v => parseInt(v)),
  toNum: (arg: string) => callIfDefined(arg, v => parseFloat(v)),
  noEmpty: (arg: string) => callIfDefined(arg, v => v.length === 0 ? undefined : v),
  noNull: (arg: string) => callIfDefined(arg, v => v === null ? undefined : v),
}

const sanitizerError = () => { throw new Error(`"${name}" is not a valid sanitizer`)}

const getSanitizer = (name: SanitizeName) => sanitizers[name] || sanitizerError

type SanitizeType = 'body'|'query'|'params'
type SanitizeSpec = {[key: string]: SanitizeName|SanitizeName[]}
type FieldSpec = string|SanitizeSpec

/**
 *
 */
function applySanitizers(source: KeyVals, target: KeyVals, spec: SanitizeSpec) {
  return Object.entries(spec).reduce((map, [key, fnName]) => {
    const value = source[key]
    if (Array.isArray(fnName)) {
      const result = fnName.reduce((val, name) => getSanitizer(name)(val), value)
      if (result !== undefined) {
        map[key] = result
      }
    } else {
      const sanitizer = getSanitizer(fnName)
      const result = sanitizer(value)
      if (result !== undefined) {
        map[key] = result
      }
    }
    return map
  }, target)
}

/**
 *
 */
function copyFields(source: KeyVals, fields: FieldSpec[]) {
  return fields.reduce((target, field) => {
    if (typeof field === 'string') {
      const value = source[field]
      if (value !== undefined) {
        target[field] = value
      }
      return target
    } else {
      return applySanitizers(source, target, field)
    }
  }, {} as KeyVals)
}

/**
 *
 */
export function sanitize(type: SanitizeType, fields: FieldSpec[]): RequestHandler {
  return (req, res, next) => {
    req[type] = copyFields(req[type], fields)
    next()
  }
}

// const request = { body: { email: 'lala@lala.com', password: 'asdf', lala: 10 }}

// const spec: SanitizeSpec = { email: 'toString', password: ['toString', 'toString'] }
// const applied = applySanitizers(request.body, spec)
// console.log(applied)

// const fields: FieldSpec[] = ['email', { password: [/* 'toString', */ 'noZero' /* 'noNull' */] }]
// const copied = copyFields(request.body, fields)
// console.log(copied)

export default sanitize
