import express from 'express'
import configureApp from './config/app'
import { mongooseConnect } from './config/mongoose'
import errorHandler from './error-handler'
import { createError } from './lib/errors'

import authRouter from './routers/auth.router'
import userRouter from './routers/user.router'
import grantsRouter from './routers/grants.router'
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
app.use('/grants', grantsRouter)
app.use('/admin', adminRouter)

/**
 * 404 Handler
 */
app.use((req, res, next) => {
  next(createError(404))
})

/**
 * Error Handler.
 */
app.use(errorHandler)

export default app
