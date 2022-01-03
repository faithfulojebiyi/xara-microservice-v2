const { json, urlencoded } = require('express')
const cors = require('cors')
const helmet = require('helmet')
const config = require('./env')
const morgan = require('morgan')
const mongoose = require('mongoose')
const { Helpers, constants, genericErrors } = require('../app/utils')
const { WELCOME, v1 } = constants
const apiRoutes = require('../app/routes')
const { notFoundApi } = genericErrors
const { GenericHelper: { errorResponse, successResponse } } = Helpers

const appConfig = (app) => {
  mongoose.connect(config.DATABASE_URL).then(() => {
    logger.info('Connected to database')
  }).catch(err => {
    logger.info(`error connecting to database, ${err.message}`)
  })
  // integrate winston logger with morgan
  app.use(morgan('combined', { stream: logger.stream }))
  // adds security middleware to handle potential attacks from HTTP requests
  app.use(helmet())
  // adds middleware for cross-origin resource sharing configuration
  app.use(cors())
  // adds middleware that parses requests whose content-type is application/json
  app.use(json())
  // adds middleware that parses requests with x-www-form-urlencoded data encoding
  app.use(urlencoded({ extended: true }))
  // adds a heartbeat route for the culture
  app.options('*', cors())
  app.get('/', (req, res) => successResponse(res, { message: WELCOME }))
  // catches 404 errors and forwards them to error handlers
  app.use(v1, apiRoutes)
  app.use((req, res, next) => {
    next(notFoundApi)
  })
  // handles all forwarded errors
  app.use((err, req, res, next) => errorResponse(req, res, err))

  // db.on('error', logger.info('MongoDB connection error:'))
  const port = config.PORT || 5003
  // server listens for connections
  app.listen(port, () => {
    logger.info(`${'XARA'} ${port} ${config.NODE_ENV}`)
  })
}

module.exports = appConfig
