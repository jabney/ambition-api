import { Router } from 'express'
import { deserializeUser } from '../middleware/authorize'
import hasRole from '../middleware/has-role'

import {
  addToWhitelistValidator,
  removeFromWhitelistValidator,
  revokeTokensValidator,
  revokeAllTokensValidator,
  getUsersValidator,
  addUserRoleValidator,
  removeUserRoleValidator,
} from '../validators/admin.validator'

import {
  addToWhtelist,
  fetchWhitelist,
  removeFromWhitelist,

  revokeTokens,
  revokeAllTokens,

  addUserRole,
  removeUserRole,

  fetchUsers,
} from '../controllers/admin.controller'

const router = Router()

const hasSuper = hasRole('super')
const hasAdmin = hasRole('admin')

const  deserializeRoles = deserializeUser('roles')

router.route('/whitelist')
  .get(deserializeRoles, hasAdmin, fetchWhitelist)
  .post(deserializeRoles, hasAdmin, addToWhitelistValidator, addToWhtelist)
  .delete(deserializeRoles, hasAdmin, removeFromWhitelistValidator, removeFromWhitelist)

router.route('/users')
  .get(deserializeRoles, hasAdmin, getUsersValidator, fetchUsers)
  // .delete(deserializeRoles, hasSuper, deleteUserValidator, deleteUser)

router.route('/users/roles')
  .post(deserializeRoles, hasAdmin, addUserRoleValidator, addUserRole)
  .delete(deserializeRoles, hasSuper, removeUserRoleValidator, removeUserRole)

router.route('/tokens')
  .delete(deserializeRoles, hasAdmin, revokeTokensValidator, revokeTokens)

router.route('/tokens/all')
  .delete(deserializeRoles, hasSuper, revokeAllTokensValidator, revokeAllTokens)

export default router
