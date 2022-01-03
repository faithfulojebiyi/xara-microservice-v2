const ApiError = require('../errors/api.error')
const constants = require('../constants')
const { DB_UNIQUE_CONSTRAINTS, RESOURCE_NOT_FOUND } = constants

/**
 *Contains ErrorFactory methods
 * @class ErrorFactory
 */
module.exports = class ErrorFactory {
  /**
   *
   * @param {Object } error - The error object
   * @returns { JSON } - An error responset
   */
  static resolveError (error) {
    let message = 'Error while processing request. It is not you, it is us.'
    let status = 500
    if (error.code === '23505') {
      message = DB_UNIQUE_CONSTRAINTS[error.constraint]
      status = 409
    }
    if (error.code === '23503') {
      message = DB_UNIQUE_CONSTRAINTS[error.constraint]
      status = 404
    }
    if (error.received === 0) {
      status = 404
      message = RESOURCE_NOT_FOUND(error.resource)
    }
    return new ApiError({ message, status })
  }
}
