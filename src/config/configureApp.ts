import express, { Application } from 'express'
import logger from 'morgan'

/**
 * Set up application middleware and misc.
 */
function configureApp(app: Application) {
  app.set('x-powered-by', null)
  app.use(logger('dev'));
  app.use(express.json());

  return app
}

export default configureApp
