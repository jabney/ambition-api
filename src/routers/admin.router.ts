import { Router } from 'express'
import { deserializeUser } from '../middleware/authorize'
import hasRole from '../middleware/has-role'

import {
  addToWhitelistValidator,
  removeFromWhitelistValidator,
  revokeTokensValidator,
  revokeAllTokensValidator,
} from '../validators/admin.validator'

import {
  addToWhtelist,
  fetchWhitelist,
  removeFromWhitelist,
  revokeTokens,
  revokeAllTokens,
} from '../controllers/admin.controller'

const router = Router()

const hasSuper = hasRole('super')
const hasAdmin = hasRole('admin')

router.use(deserializeUser('roles'))

router.route('/whitelist')
  .get(hasAdmin, fetchWhitelist)
  .post(hasAdmin, addToWhitelistValidator, addToWhtelist)
  .delete(hasAdmin, removeFromWhitelistValidator, removeFromWhitelist)

router.route('/tokens/revoke')
  .delete(hasAdmin, revokeTokensValidator, revokeTokens)

router.route('/tokens/revoke/all')
  .delete(hasSuper, revokeAllTokensValidator, revokeAllTokens)

export default router
