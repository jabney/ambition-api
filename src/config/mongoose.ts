import util from 'util'
import { connect as _connect, ConnectionOptions } from 'mongoose'
import { MongoError } from 'mongodb'

const debug = util.debuglog('ambition:app')

/**
 * Options to avoid deprecation warnings.
 */
const connectionOptions: ConnectionOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}

export type ConnectCallback = (err: MongoError) => void

/**
 * Connect to MongoDB.
 */
export const connect = (onConnectOrError: ConnectCallback) => {
  _connect(<string>process.env.MONGODB_URL, connectionOptions, onConnectOrError)
}

/**
 * Connect to MongoDB and use standard messages.
 */
export function mongooseConnect() {
  connect((err) => {
    if (err) { return console.error('MongoDB Error:', err) }
    debug('MongoDB connected via Mongoose Connect')
  })
}

export default connect
