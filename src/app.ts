import express from 'express'
import { createError } from './lib/errors'
import errorHandler from './error-handler'
import { mongooseConnect } from './config/mongoose'
import configureApp from './config/app'

import authRouter from './routers/auth.router'
import userRouter from './routers/user.router'
import adminRouter from './routers/admin.router'

// Connect to MongoDB.
mongooseConnect()

// Create the app instance.
const app = configureApp(express())

/**
 * API Routes
 */
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/admin', adminRouter)

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
