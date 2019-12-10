import { body, param, query, ValidationChain } from 'express-validator'
import { grants } from '../../config/grants'

type Location = 'body'|'query'|'param'

const location: {[K in Location]: (field: string) => ValidationChain} = {
  body,
  param,
  query,
}

const email = (loc: Location) => location[loc]('email')
  .trim()
  .isEmail().withMessage('must be a valid email')

const password = (loc: Location) => location[loc]('password')
  .isString().withMessage('must be a string')
  .isLength({ min: 1, max: 72 }).withMessage('must be between 1 and 72 characters')

const first = (loc: Location) => location[loc]('first')
  .trim()
  .isString().withMessage('must be a string')
  .isLength({ min: 1, max: 64 }).withMessage('must be between 1 and 64 characters')

const last = (loc: Location) => location[loc]('last')
  .trim()
  .isString().withMessage('must be a string')
  .isLength({ min: 1, max: 64 }).withMessage('must be between 1 and 64 characters')

const grant = (loc: Location) => location[loc]('grant')
  .trim()
  .isString().withMessage('must be a string')
  .isIn(grants).withMessage('must be a valid grant')

export default {
  body: {
    email: () => email('body'),
    first: () => first('body'),
    last: () => last('body'),
    password: () => password('body'),
    grant: () => grant('body'),
  },

  query: {

  },

  param: {

  },
}
