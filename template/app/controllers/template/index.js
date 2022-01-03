const Template = require('../../models/template')
const { Helpers, constants, DBError, ApiError } = require('../../utils')

const {
  GenericHelper: { successResponse, moduleErrLogMessager, errorResponse }
} = Helpers

const {
  CREATE_TEMPLATE_ERROR,
  CREATE_TEMPLATE_SUCCESS,
  TEMPLATE_NOT_FOUND,
  DELETE_TEMPLATE_SUCCESS,
  DELETE_TEMPLATE_ERROR,
  FETCH_TEMPLATE_ERROR,
  FETCH_TEMPLATE_SUCCESS
} = constants

/**
 * A collection of methods that controls the success response
 * for CRUD operations on the Template.
 *
 * @class TemplateController
 */
class TemplateController {
  /**
   * Controller used for adding templates
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @param {Next} next - The next function
   * @returns { JSON } A JSON response containing the details of the contact us added
   * @memberof TemplateController
   */
  static async createTemplate (req, res, next) {
    try {
      const template = await Template.create({
        ...req.body
      })
      return successResponse(res, {
        message: CREATE_TEMPLATE_SUCCESS,
        data: template
      })
    } catch (e) {
      const dbError = new DBError({
        status: CREATE_TEMPLATE_ERROR,
        message: e.message
      })
      moduleErrLogMessager(dbError)
      next(new ApiError({ message: CREATE_TEMPLATE_ERROR }))
    }
  }

  /**
   * Controller used for fetching templates
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @param {Next} next - The next function
   * @returns { JSON } A JSON response containing the details of the contact us added
   * @memberof CategoryController
   */
  static async getAllTemplates (req, res, next) {
    try {
      const categories = await Template.find({})
      return successResponse(res, {
        message: FETCH_TEMPLATE_SUCCESS,
        data: categories
      })
    } catch (e) {
      const dbError = new DBError({
        status: FETCH_TEMPLATE_ERROR,
        message: e.message
      })
      moduleErrLogMessager(dbError)
      next(new ApiError({ message: FETCH_TEMPLATE_ERROR }))
    }
  }

  /**
   * Controller used for deleting templates
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @param {Next} next - The next function
   * @returns { JSON } A JSON response containing the details of the contact us added
   * @memberof TemplateController
   */
  static async deleteTemplate (req, res, next) {
    try {
      const template = await Template.findByIdAndDelete(req.params.id)
      if (!template) {
        return errorResponse(
          req,
          res,
          new ApiError({
            status: 404,
            message: TEMPLATE_NOT_FOUND
          })
        )
      }
      return successResponse(res, {
        message: DELETE_TEMPLATE_SUCCESS,
        data: { ...template }
      })
    } catch (e) {
      const dbError = new DBError({
        status: DELETE_TEMPLATE_ERROR,
        message: e.message
      })
      moduleErrLogMessager(dbError)
      next(new ApiError({ message: DELETE_TEMPLATE_ERROR }))
    }
  }
}

module.exports = TemplateController
