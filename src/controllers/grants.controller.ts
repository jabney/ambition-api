import { RequestHandler } from 'express'
import { grantList } from '../config/grants'

/**
 *
 */
export const fetchGrants: RequestHandler = async (req, res, next) => {
  res.json({ grants: grantList })
}
