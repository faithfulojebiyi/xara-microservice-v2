const mongoose = require('mongoose')
const config = require('../../config/env')
const db = mongoose.createConnection(config.DATABASE_URL)

module.exports = db
