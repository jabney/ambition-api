import { booleanize } from './lib/env-helpers'

const ALLOW_UNSECURE = booleanize(process.env.ALLOW_HTTP)

export default Object.freeze({
  /**
   * Don't reject non-https requests.
   */
  ALLOW_UNSECURE,
})
