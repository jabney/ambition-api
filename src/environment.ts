import {
  booleanize,
  getOrRandom,
  getOrThrow,
  integerize,
} from './lib/env-helpers'

const PRODUCTION = booleanize(process.env.NODE_ENV, 'production')
const DEVELOPMENT = !PRODUCTION

const MONGODB_URI = process.env.MONGODB_URI
const ALLOW_UNSECURE = booleanize(process.env.ALLOW_UNSECURE)
const TRUST_PROXY = integerize(process.env.TRUST_PROXY, 0)
const API_KEY = process.env.API_KEY

const JWT_SECRET = getOrRandom(process.env.JWT_SECRET)
const JWT_ISSUER = getOrThrow('JTW_ISSUER')
const JWT_AUDIENCE = getOrThrow('JWT_AUDIENCE')
const JWT_EXPIRES_IN_DAYS = integerize(process.env.JWT_EXPIRES_IN_DAYS, 7)

const PASSWORD_COST_FACTOR = integerize(process.env.PASSWORD_COST_FACTOR, 10)

export default Object.freeze({
  DEVELOPMENT,
  PRODUCTION,
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
