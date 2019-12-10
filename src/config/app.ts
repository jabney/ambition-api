import express, { Application } from 'express'
import logger from 'morgan'
import env from '../environment'
import rejectHttp from '../middleware/reject-http'

/**
 * Set up application middleware and misc.
 */
function configureApp(app: Application) {
  app.set('x-powered-by', null)

  // Set trust proxy for heroku, etc.
  if (env.TRUST_PROXY > 0) {
    app.set('trust proxy', env.TRUST_PROXY)
  }

  app.use(logger('dev'))
  app.use(express.json({ limit: '1kb'}))

  app.use(rejectHttp())

  return app
}

export default configureApp
