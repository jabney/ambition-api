import { Router } from 'express'
import { deserializeUser } from '../middleware/authorize'

import {
  updateUserValidator,
  addGrantValidator,
  removeGrantValidator,
} from '../validators/user.validator'

import {
  fetchUser,
  updateUser,
  deleteUser,

  fetchGrants,
  addGrant,
  removeGrant,
} from '../controllers/user.controller'

const router = Router()

const deserializeProfile = deserializeUser('email first last grants roles')
const deserializeMin = deserializeUser('_id')
const deserializeStd = deserializeUser('grants')

router.route('/')
  .get(deserializeProfile, fetchUser)
  .patch(deserializeMin, updateUserValidator, updateUser)
  .delete(deserializeMin, deleteUser)

router.route('/grants')
  .get(deserializeStd, fetchGrants)
  .post(deserializeStd, addGrantValidator, addGrant)
  .delete(deserializeStd, removeGrantValidator, removeGrant)

export default router
