const constants = require('../constants')
const DBError = require('../errors/db.error')
const genericError = require('../errors/generic')

const { serverError } = genericError
const { FAIL, SUCCESS, SUCCESS_RESPONSE } = constants

/**
 *Contains GenericHelper methods
 * @class GenericHelper
 */
class GenericHelper {
  /**
   * It validates a schema and returns a boolean
   * @static
   * @param { Joi } schema - The validation schema.
   * @param { Object } object - The data to be validated
   * @memberof Helper
   * @returns { boolean } - True if validation succeeded, false otherwise
   */
  static async validateInput (schema, object) {
    return schema.validateAsync(object)
  }

  /**
   * Get the ip address
   * @param {Request} req - Request object.
   * @returns {string} ip address
   */
  static getIpAddress (req) {
    return req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress
  }

  /**
   * Creates DB Error object and logs it with respective error message and status.
   * @static
   * @param { String | Object } data - The data.
   * @memberof Helper
   * @returns { Object } - It returns an Error Object.
   */
  static makeError ({ error, status }) {
    const dbError = new DBError({
      status,
      message: error.message
    })
    GenericHelper.moduleErrLogMessager(dbError)
    return dbError
  }

  /**
   * Generates a JSON response for success scenarios.
   * @static
   * @param {Response} res - Response object.
   * @param {object} options - An object containing response properties.
   * @param {object} options.data - The payload.
   * @param {string} options.message -  HTTP Status code.
   * @param {number} options.code -  HTTP Status code.
   * @memberof Helpers
   * @returns {JSON} - A JSON success response.
   */
  static successResponse (
    res,
    { data, message = SUCCESS_RESPONSE, code = 200 }
  ) {
    return res.status(code).json({
      status: SUCCESS,
      message,
      data
    })
  }

  /**
   * Generates a JSON response for failure scenarios.
   * @static
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @param {object} error - The error object.
   * @param {number} error.status -  HTTP Status code, default is 500.
   * @param {string} error.message -  Error message.
   * @param {object|array} error.errors -  A collection of  error message.
   * @memberof Helpers
   * @returns {JSON} - A JSON failure response.
   */
  static errorResponse (req, res, error) {
    const aggregateError = { ...serverError, ...error }
    GenericHelper.apiErrLogMessager(aggregateError, req)
    return res.status(aggregateError.status).json({
      status: FAIL,
      message: aggregateError.message,
      errors: aggregateError.errors
    })
  }

  /**
   * Generates log for module errors.
   * @static
   * @param {object} error - The module error object.
   * @memberof Helpers
   * @returns { Null } -  It returns null.
   */
  static moduleErrLogMessager (error) {
    return logger.error(`${error.status} - ${error.name} - ${error.message}`)
  }

  /**
   * Generates log for api errors.
   * @static
   * @param {object} error - The API error object.
   * @param {Request} req - Request object.
   * @memberof Helpers
   * @returns {String} - It returns null.
   */
  static apiErrLogMessager (error, req) {
    const ip = GenericHelper.getIpAddress(req)
    logger.error(
      `${error.name} - ${error.status} - ${error.message} - ${req.originalUrl} - ${req.method} - ${ip}`
    )
  }
}

module.exports = GenericHelper
