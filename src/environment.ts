import { booleanize, integerize } from './lib/env-helpers'

const ALLOW_UNSECURE = booleanize(process.env.ALLOW_UNSECURE)
const TRUST_PROXY = integerize(process.env.TRUST_PROXY, 0)
const API_KEY = process.env.API_KEY

export default Object.freeze({
  /**
   * Don't reject non-https requests.
   */
  ALLOW_UNSECURE,
  /**
   * Determines trust proxy hops for app configuration.
   */
  TRUST_PROXY,
  /**
   * Api key for protecting some auth routes.
   */
  API_KEY,
})
