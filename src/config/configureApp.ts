import express, { Application } from 'express'
import logger from 'morgan'
import rejectHttp from '../middleware/reject-http'

/**
 * Set up application middleware and misc.
 */
function configureApp(app: Application) {
  app.set('x-powered-by', null)
  app.use(logger('dev'));
  app.use(express.json({ limit: '1kb'}));

  app.use(rejectHttp())

  return app
}

export default configureApp
