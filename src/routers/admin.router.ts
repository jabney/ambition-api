import { Router } from 'express'
import { deserializeUser } from '../middleware/authorize'
import hasRole from '../middleware/has-role'
import { addValidator, removeValidator } from '../validators/admin.validator'

import {
  addToWhtelist,
  fetchWhitelist,
  removeFromWhitelist,
  revokeToken,
  revokeAllTokens,
} from '../controllers/admin.controller'

const router = Router()

const hasSuper = hasRole('super')
const hasAdmin = hasRole('admin')

router.use(deserializeUser('roles'))

router.route('/whitelist')
  .get(hasAdmin, fetchWhitelist)
  .post(hasAdmin, addValidator, addToWhtelist)
  .delete(hasAdmin, removeValidator, removeFromWhitelist)

router.route('/tokens/revoke')
  .delete(hasAdmin, revokeToken)

router.route('/tokens/revoke/all')
  .delete(hasSuper, revokeAllTokens)

export default router
