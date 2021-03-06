import {
  booleanize,
  getOrRandom,
  getOrThrow,
  integerize,
} from './lib/env-helpers'

const PRODUCTION = booleanize(process.env.NODE_ENV, 'production')
const TEST = booleanize(process.env.NODE_ENV, 'test')
const DEVELOPMENT = !PRODUCTION && !TEST

const MONGODB_URI = process.env.MONGODB_URI
const ALLOW_UNSECURE = booleanize(process.env.ALLOW_UNSECURE)
const TRUST_PROXY = integerize(process.env.TRUST_PROXY, 0)
const API_KEY = process.env.API_KEY
const REQUIRE_WHITELISTED = booleanize(process.env.REQUIRE_WHITELISTED, 'true')

const JWT_SECRET = getOrRandom(process.env.JWT_SECRET)
const JWT_ISSUER = getOrThrow('JTW_ISSUER')
const JWT_AUDIENCE = getOrThrow('JWT_AUDIENCE')
const JWT_EXPIRES_IN_DAYS = integerize(process.env.JWT_EXPIRES_IN_DAYS, 7)

const PASSWORD_COST_FACTOR = integerize(process.env.PASSWORD_COST_FACTOR, 10)

const env = Object.freeze({
  DEVELOPMENT,
  PRODUCTION,
  TEST,
  MONGODB_URI,
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
  /**
   * Enforce whitelist compliance on user signup and signin.
   */
  REQUIRE_WHITELISTED,
  /**
   * Secret for encoding tokens.
   */
  JWT_SECRET,
  /**
   * The token issuer.
   */
  JWT_ISSUER,
  /**
   * The token audience.
   */
  JWT_AUDIENCE,
  /**
   * Time until token expires.
   */
  JWT_EXPIRES_IN_DAYS,
  /**
   * Cost factor for password hashing.
   */
  PASSWORD_COST_FACTOR,
})

export default env
