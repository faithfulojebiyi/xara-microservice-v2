const constants = require('../constants')
const ModuleError = require('./module.error')

const { DB_ERROR, DB_ERROR_STATUS } = constants

/**
 * A custom error class for handling Database errors.
 * @class DBError
 */
module.exports = class DBError extends ModuleError {
  /**
    * The DBError Constructor.
    * @param {Object} options - A configuration object for errors.
    * @param {String} options.message - The error message if any.
    * @param {Number} options.status - The status code of error if any.
    * @param {Array} options.errors - Additional error details if any.
    * @constructor DBError
    */
  constructor (options = {}) {
    super(options)
    this.name = this.constructor.name
    this.message = options.message || DB_ERROR
    this.status = options.status || DB_ERROR_STATUS
  }
}
