import express from 'express'
import logger from 'morgan'
import { HttpError } from './lib/errors'
import errorHandler from './error-handler'

var app = express();

app.use(logger('dev'));
app.use(express.json());

/**
 * API Routes
 */

/**
 * 404 Handler
 */
app.use(function(req, res, next) {
  next(new HttpError(404));
});

/**
 * Error Handler.
 */
app.use(errorHandler);

export default app
