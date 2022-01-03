/**
 * constain Validation Helpers
 * @class ValidationHelper
 */
class ValidationHelper {
  /**
   * It validates a string
   * @static
   * @memberof ValidationHelper
   * @param {string} param - The name of the field to validate
   * @param {object} joiObject - The joi object
   * @param {integer} min - The minimum value of the field
   * @param {integer} max - The maximum value of the field
   * @returns {Boolean} - True or false
   */
  static stringCheck (param, joiObject, min = 1, max = 100) {
    return joiObject
      .string()
      .required()
      .min(min)
      .max(max)
      .messages({
        'any.required': `${param} is a required field`,
        'string.max': `${param} can not be more than ${max} characters`,
        'string.min': `${param} can not be lesser than ${min} characters`,
        'string.base': `${param} must be a string`,
        'string.empty': `${param} cannot be an empty field`
      })
  }
}

module.exports = ValidationHelper
