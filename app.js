'use strict'

const express = require('express')
const app = express()
app.set('etag', false)
app.set('x-powered-by', false)

// middleware
const middleware = require('./src/middleware')
app.use(middleware)

// routes
const config = require('config')
const API_CONTEXT = (config.api.context || '')
const routes = require('./src/routes')
app.use(API_CONTEXT, routes)

// error handler
const errHandler = require('./src/middleware/error_handler')
app.use(errHandler)

// export app
module.exports = app
