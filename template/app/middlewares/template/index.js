const TemplateService = require('../../services/template')
const { Helpers, constants, ApiError } = require('../../utils')

const { getTemplateById } = TemplateService

const {
  GenericHelper: { errorResponse, moduleErrLogMessager }
} = Helpers

const {
  TEMPLATE_NOT_FOUND,
  GENERIC_ERROR,
  RESOURCE_EXIST_VERIFICATION_FAIL
} = constants

/**
 * A collection of middleware methods for template
 * @class TemplateMiddleware
 */
class TemplateMiddleware {
  /**
   * Validates Template request credentials.
   * @static
   * @param { Object } req - The request from the endpoint.
   * @param { Object } res - The response returned by the method.
   * @param { function } next - Calls the next handle.
   * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
   * @memberof TemplateMiddleware
   */
  static async CheckTemplateId (req, res, next) {
    try {
      const template = await getTemplateById(req.body.user_id)
      req.template = template
      return template
        ? next()
        : errorResponse(
          req,
          res,
          new ApiError({
            status: 404,
            message: TEMPLATE_NOT_FOUND
          })
        )
    } catch (e) {
      e.status = RESOURCE_EXIST_VERIFICATION_FAIL('TEMPLATE')
      moduleErrLogMessager(e)
      const apiError = new ApiError({
        status: 500,
        message: GENERIC_ERROR
      })
      errorResponse(req, res, apiError)
    }
  }
}

module.exports = TemplateMiddleware
