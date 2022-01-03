const jwt = require('jsonwebtoken')
const config = require('../../../config/env')
const { JWT_SECRET } = config

/**
 * Contains Authentication Helper Methods
 * @class AuthHelper
 */
class AuthHelper {
  /**
   * It generates a unique password.
   * @static
   * @memberof Helper
   * @returns {String} - A unique string.
   */
  static generateUniquePassword () {
    return `${Math.random().toString(32).substr(2, 10)}`
  }

  /**
   * Create a signed json web token
   * @param {string | number | Buffer | object} payload - Payload to sign
   * @param {string | number} expiresIn - Expressed in seconds or a string describing a
   * time span. Eg: 60, "2 days", "10h", "7d". Default specified is 2 hours.
   * @memberof Helper
   * @returns {string} -JWT token
   */
  static generateToken (payload, expiresIn = '2d') {
    return jwt.sign(payload, JWT_SECRET, { expiresIn })
  }

  /**
   * This verify the JWT token with the secret with which the token was issued with
   * @static
   * @param {string} token - JWT Token
   * @memberof Helper
   * @returns {string | number | Buffer | object } - Decoded JWT payload if
   * token is valid or an error message if otherwise.
   */
  static verifyToken (token) {
    return jwt.verify(token, JWT_SECRET)
  }
}

module.exports = AuthHelper
