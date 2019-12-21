import { RequestHandler } from 'express'
import { createError } from '../lib/errors'
import { Token } from '../models/token.model'
import { IProfileInfo } from '../models/profile-info.interface'

/*****************************************************************
 * Profile
 */

/**
 *
 */
export const fetchUser: RequestHandler = async (req, res, next) => {
  res.json({ user: req.user })
}

/**
 *
 */
export const updateUser: RequestHandler = async (req, res, next) => {
  const user = req.user
  const info: IProfileInfo = req.body

  try {
    // Update the user with the given fields.
    await user.updateOne(info, { runValidators: true })

    /**
     * Check if we should update the password.
     */
    const { password } = info

    if (password) {
      user.passwordInfo = { password }
      await user.save()
    }

    res.json({ data: 'user updated' })

  } catch (e) {
    next(createError(e))
  }
}

/**
 *
 */
export const deleteUser: RequestHandler = async (req, res, next) => {
  const { _id: userId } = req.user

  try {
    await Token.deleteMany({ userId })
    await req.user.remove()

    res.json({ data: 'user and associated data deleted '})

  } catch (e) {
    next(createError(e))
  }
}

/*****************************************************************
 * Settings
 */

/**
 *
 */
export const fetchSettings: RequestHandler = async (req, res, next) => {
  const user = req.user
  const settings = `{"settings":${user.settings}}`
  res.set('Content-Type', 'application/json').send(settings)
}

/**
 *
 */
export const updateSettings: RequestHandler = async (req, res, next) => {
  const { settings } = req.body

  try {
    const user = req.user
    user.settings = JSON.stringify(settings)
    await user.save()

    res.json({ data: 'settings updated' })

  } catch (e) {
    return next(createError(e))
  }
}

/**
 *
 */
export const deleteSettings: RequestHandler = async (req, res, next) => {
  const user = req.user

  try {
    user.settings = JSON.stringify({})
    await user.save()

    res.json({ data: 'settings deleted' })

  } catch (e) {
    return next(createError(e))
  }
}

/*****************************************************************
 * Grants
 */

/**
 *
 */
export const fetchGrants: RequestHandler = async (req, res, next) => {
  res.json({ grants: req.user.grants })
}

/**
 *
 */
export const addGrant: RequestHandler = async (req, res, next) => {
  const { grant } = req.body

  try {
    const user = req.user

    await user.updateOne({ $addToSet: { grants: grant }}, { runValidators: true })
    res.json({ data: `added grant "${grant}"` })

  } catch (e) {
    return next(createError(e))
  }
}

/**
 *
 */
export const removeGrant: RequestHandler = async (req, res, next) => {
  const { grant } = req.body

  try {
    const user = req.user

    await user.updateOne({ $pull: { grants: grant } })
    res.json({ data: `removed grant "${grant}"` })

  } catch (e) {
    return next(createError(e))
  }
}
