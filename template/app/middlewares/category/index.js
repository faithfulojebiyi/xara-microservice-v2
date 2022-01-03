const CategoryService = require('../../services/category')
const { Helpers, constants, ApiError } = require('../../utils')

const { getCategoryById } = CategoryService

const {
  GenericHelper: { errorResponse, moduleErrLogMessager }
} = Helpers

const {
  CATEGORY_NOT_FOUND,
  GENERIC_ERROR,
  RESOURCE_EXIST_VERIFICATION_FAIL
} = constants

/**
 * A collection of middleware methods for category
 * @class CategoryMiddleware
 */
class CategoryMiddleware {
  /**
   * Validates Category request credentials check if category exists.
   * @static
   * @param { Object } req - The request from the endpoint.
   * @param { Object } res - The response returned by the method.
   * @param { function } next - Calls the next handle.
   * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
   * @memberof CategoryMiddleware
   */
  static async CheckCategoryId (req, res, next) {
    try {
      const id = req.params.id || req.body.categoryId
      if (id) {
        const category = await getCategoryById(id)
        req.category = category
        return category
          ? next()
          : errorResponse(
            req,
            res,
            new ApiError({
              status: 404,
              message: CATEGORY_NOT_FOUND
            })
          )
      } else {
        next()
      }
    } catch (e) {
      e.status = RESOURCE_EXIST_VERIFICATION_FAIL('CATEGORY')
      moduleErrLogMessager(e)
      const apiError = new ApiError({
        status: 500,
        message: GENERIC_ERROR
      })
      errorResponse(req, res, apiError)
    }
  }

  /**
   * Creates ancestors data.
   * @static
   * @param { Object } req - The request from the endpoint.
   * @param { Object } res - The response returned by the method.
   * @param { function } next - Calls the next handle.
   * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
   * @memberof CategoryMiddleware
   */
  static createAncestors (req, res, next) {
    try {
      if (req.category) {
        const { category } = req
        const ancsetors = category.ancestorsIds
        ancsetors.push(req.body.categoryId)
        req.body.ancestorsIds = ancsetors
        next()
      } else {
        next()
      }
    } catch (e) {
      e.status = RESOURCE_EXIST_VERIFICATION_FAIL('CATEGORY')
      moduleErrLogMessager(e)
      const apiError = new ApiError({
        status: 500,
        message: GENERIC_ERROR
      })
      errorResponse(req, res, apiError)
    }
  }

  /**
   * Validates toCategory request credentials.
   * toCategory is the category to which the category is being moved.
   * @static
   * @param { Object } req - The request from the endpoint.
   * @param { Object } res - The response returned by the method.
   * @param { function } next - Calls the next handle.
   * @returns { JSON | Null } - Returns error response if validation fails or Null if otherwise.
   * @memberof CategoryMiddleware
   */
  static async checkToCategory (req, res, next) {
    try {
      const category = await getCategoryById(req.body.toCategoryId)
      req.tocategory = category
      return category
        ? next()
        : errorResponse(
          req,
          res,
          new ApiError({
            status: 404,
            message: CATEGORY_NOT_FOUND
          })
        )
    } catch (e) {
      e.status = RESOURCE_EXIST_VERIFICATION_FAIL('CATEGORY')
      moduleErrLogMessager(e)
      const apiError = new ApiError({
        status: 500,
        message: GENERIC_ERROR
      })
      errorResponse(req, res, apiError)
    }
  }
}

module.exports = CategoryMiddleware
