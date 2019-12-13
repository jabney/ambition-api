import { Router } from 'express'
import { deserializeUser } from '../middleware/authorize'

import {
  updateUserValidator,
  updateSettingsValidator,
  addGrantValidator,
  removeGrantValidator,
} from '../validators/user.validator'

import {
  fetchUser,
  updateUser,
  deleteUser,

  fetchSettings,
  updateSettings,
  deleteSettings,

  fetchGrants,
  addGrant,
  removeGrant,
} from '../controllers/user.controller'

const router = Router()

const deserializeProfile = deserializeUser('email first last grants roles')
const deserializeMin = deserializeUser('_id')
const deserializeGrants = deserializeUser('grants')
const deserializeSettings = deserializeUser('settings')

router.route('/')
  .get(deserializeProfile, fetchUser)
  .patch(deserializeMin, updateUserValidator, updateUser)
  .delete(deserializeMin, deleteUser)

router.route('/settings')
  .get(deserializeSettings, fetchSettings)
  .post(deserializeSettings, updateSettingsValidator, updateSettings)
  .delete(deserializeSettings, deleteSettings)

router.route('/grants')
  .get(deserializeGrants, fetchGrants)
  .post(deserializeGrants, addGrantValidator, addGrant)
  .delete(deserializeGrants, removeGrantValidator, removeGrant)

export default router
