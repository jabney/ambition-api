import { MongoError } from 'mongodb'
import { connect as _connect, ConnectionOptions } from 'mongoose'
import util from 'util'

const debug = util.debuglog('ambition:app')

/**
 * Options to avoid deprecation warnings.
 */
const connectionOptions: ConnectionOptions = {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

export type ConnectCallback = (err: MongoError) => void

/**
 * Connect to MongoDB.
 */
export const connect = (onConnectOrError: ConnectCallback) => {
  _connect(process.env.MONGODB_URL as string, connectionOptions, onConnectOrError)
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
