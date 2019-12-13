import { Router } from 'express'
import { deserializeUser } from '../middleware/authorize'
import hasRole from '../middleware/has-role'

import {
  addToWhitelistValidator,
  removeFromWhitelistValidator,
  revokeTokensValidator,
  revokeAllTokensValidator,
  getUsersValidator,
} from '../validators/admin.validator'

import {
  addToWhtelist,
  fetchWhitelist,
  removeFromWhitelist,

  revokeTokens,
  revokeAllTokens,

  fetchUsers,
} from '../controllers/admin.controller'

const router = Router()

const hasSuper = hasRole('super')
const hasAdmin = hasRole('admin')

const  deserializeRoles = deserializeUser('roles')

router.use(deserializeUser('roles'))

router.route('/whitelist')
  .get(deserializeRoles, hasAdmin, fetchWhitelist)
  .post(deserializeRoles, hasAdmin, addToWhitelistValidator, addToWhtelist)
  .delete(deserializeRoles, hasAdmin, removeFromWhitelistValidator, removeFromWhitelist)

router.route('/users')
  .get(deserializeRoles, hasAdmin, getUsersValidator, fetchUsers)

router.route('/tokens')
  .delete(hasAdmin, revokeTokensValidator, revokeTokens)

router.route('/tokens/all')
  .delete(hasSuper, revokeAllTokensValidator, revokeAllTokens)

export default router
