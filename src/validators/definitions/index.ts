import { body, param, query, ValidationChain } from 'express-validator'
import { grants } from '../../config/grants'

type Location = 'body'|'query'|'param'

const location: {[K in Location]: (field: string) => ValidationChain} = {
  body,
  param,
  query,
}

const email = (loc: Location, name: string) => location[loc](name)
  .trim()
  .isEmail().withMessage('must be a valid email')

const password = (loc: Location, name: string) => location[loc](name)
  .isString().withMessage('must be a string')
  .isLength({ min: 1, max: 72 }).withMessage('must be between 1 and 72 characters')

const str = (loc: Location, name: string, max: number) => location[loc](name)
  .trim()
  .isString().withMessage('must be a string')
  .isLength({ min: 1, max }).withMessage('must be between 1 and 64 characters')

const grant = (loc: Location, name: string) => location[loc](name)
  .trim()
  .isString().withMessage('must be a string')
  .isIn(grants).withMessage('must be a valid grant')

const mongoId = (loc: Location, name: string) => location[loc](name)
  .trim()
  .isMongoId().withMessage('must be a MongoID')

const boolean = (loc: Location, name: string) => location[loc](name)
  .isBoolean().withMessage('must be a boolean')

export default {
  email: (name = 'email', where: Location = 'body') => email(where, name),
  strShort: (name: string, where: Location = 'body') => str(where, name, 64),
  strMed: (name: string, where: Location = 'body') => str(where, name, 128),
  strLong: (name: string, where: Location = 'body') => str(where, name, 256),
  password: (name = 'password', where: Location = 'body') => password(where, name),
  grant: (name = 'grant', where: Location = 'body') => grant(where, name),
  mongoId: (name: string, where: Location = 'body') => mongoId(where, name),
  boolean: (name: string, where: Location = 'body') => boolean(where, name),
}
