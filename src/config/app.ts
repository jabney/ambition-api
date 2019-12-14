import express, { Application } from 'express'
import logger from 'morgan'
import env from '../environment'
import rejectHttp from '../middleware/reject-http'

/**
 * Set up application middleware and misc.
 */
function configureApp(app: Application) {
  // Obfuscate server software.
  app.set('x-powered-by', null)

  // Set trust proxy for heroku, etc.
  if (env.TRUST_PROXY > 0) {
    app.set('trust proxy', env.TRUST_PROXY)
  }

  // Allow https only.
  app.use(rejectHttp())

  // Log requests.
  app.use(logger('dev', {
    skip: () => env.TEST,
  }))

  // Parse json bodies (expect 2kb or less payload size).
  app.use(express.json({ limit: '2kb'}))

  return app
}

export default configureApp
