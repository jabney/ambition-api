/**
 *
 * Module dependencies.
 */

import http from 'http'
import util from 'util'
import app from './app'

const debug = util.debuglog('ambition:server')

/**
 * Get port from environment and store in Express.
 */

const PORT = normalizePort(process.env.PORT || '3000')
app.set('port', PORT)

/**
 * Create HTTP server.
 */

const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(PORT)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(value: number|string) {
  const port = parseInt(value as string, 10)

  if (isNaN(port)) {
    // named pipe
    return value
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof PORT === 'string'
    ? 'Pipe ' + PORT
    : 'Port ' + PORT

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address()

  if (addr == null) {
    throw new Error('server address is null')
  }

  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
}
