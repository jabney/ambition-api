import express from 'express'
import { createError } from './lib/errors'
import errorHandler from './error-handler'
import { mongooseConnect } from './config/mongoose'
import configureApp from './config/app'

// Connect to MongoDB.
mongooseConnect()

// Create the app instance.
const app = configureApp(express())

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
