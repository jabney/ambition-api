import { RequestHandler } from 'express'
import { createError } from '../lib/errors'
import { Whitelist } from '../models/whitelist.model'

/**
 *
 */
export const fetchWhitelist: RequestHandler = async (req, res, next) => {
  try {
    const doc = await Whitelist.findOne()
    const whitelist = doc && doc.allowed || []

    res.json({ whitelist })

  } catch (e) {
    next(createError(e))
  }
}

/**
 *
 */
export const addToWhtelist: RequestHandler = async (req, res, next) => {
  const { email } = req.body

  try {
    await Whitelist.updateOne({}, { $addToSet: { allowed: email }}, {
      upsert: true,
      runValidators: true,
    })

    res.json({ data: 'email added' })

  } catch (e) {
    return next(createError(e))
  }
}

/**
 *
 */
export const removeFromWhitelist: RequestHandler = async (req, res, next) => {
  const { email } = req.body

  try {
    await Whitelist.updateOne({}, { $pull: { allowed: email }}, { upsert: true })

    res.json({ data: 'email removed' })

  } catch (e) {
    return next(createError(e))
  }
}
