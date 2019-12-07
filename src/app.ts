import express from 'express'
import logger from 'morgan'
import { createError } from './lib/errors'
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
  next(createError(404));
});

/**
 * Error Handler.
 */
app.use(errorHandler);

export default app
