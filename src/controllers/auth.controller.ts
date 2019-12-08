import { RequestHandler } from 'express'

/**
 *
 */
export const signup: RequestHandler = (req, res, next) => {
  res.json({ data: 'signup' })
}

/**
 *
 */
export const signin: RequestHandler = (req, res, next) => {
  res.json({ data: 'signin' })

}

/**
 *
 */
export const signout: RequestHandler = (req, res, next) => {
  res.json({ data: 'signout' })
}

/**
 *
 */
export const signoutAll: RequestHandler = (req, res, next) => {
  res.json({ data: 'signoutAll' })
}
