const express = require('express')
const { appConfig } = require('./config')
const Logger = require('./config/logger')

// create express app
const app = express()
// initialize logger
global.logger = Logger.createLogger({ label: 'XARA_TEMPLATE_MICROSERVICE' })
// sets logger as a global variable

appConfig(app)

module.exports = app
