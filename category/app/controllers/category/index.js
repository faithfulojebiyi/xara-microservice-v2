const Category = require('../../models/category')
const { Helpers, constants, DBError, ApiError } = require('../../utils')
const Template = require('../../models/template')
const db = require('../../db')

const {
  GenericHelper: { successResponse, moduleErrLogMessager }
} = Helpers

const {
  CREATE_CATEGORY_ERROR,
  CREATE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_ERROR,
  UPDATE_CATEGORY_ERROR,
  UPDATE_CATEGORY_SUCCESS,
  FETCH_CATEGORY_ERROR,
  FETCH_CATEGORY_SUCCESS
} = constants

/**
 * A collection of methods that controls the success response
 * for CRUD operations on the Category.
 *
 * @class CategoryController
 */
class CategoryController {
  /**
   * Controller used for adding categories
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @param {Next} next - The next function
   * @returns { JSON } A JSON response containing the details of the contact us added
   * @memberof CategoryController
   */
  static async createCategory (req, res, next) {
    try {
      const category = await Category.create({
        ...req.body
      })
      return successResponse(res, {
        message: CREATE_CATEGORY_SUCCESS,
        data: category
      })
    } catch (e) {
      const dbError = new DBError({
        status: CREATE_CATEGORY_ERROR,
        message: e.message
      })
      moduleErrLogMessager(dbError)
      next(new ApiError({ message: CREATE_CATEGORY_ERROR }))
    }
  }

  /**
   * Controller used for fetching categories
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @param {Next} next - The next function
   * @returns { JSON } A JSON response containing the details of the contact us added
   * @memberof CategoryController
   */
  static async getAllCategories (req, res, next) {
    try {
      const categories = await Category.find({})
      return successResponse(res, {
        message: FETCH_CATEGORY_SUCCESS,
        data: categories
      })
    } catch (e) {
      const dbError = new DBError({
        status: FETCH_CATEGORY_ERROR,
        message: e.message
      })
      moduleErrLogMessager(dbError)
      next(new ApiError({ message: FETCH_CATEGORY_ERROR }))
    }
  }

  /**
   * Controller used for deleting categories
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @param {Next} next - The next function
   * @returns { JSON } A JSON response containing the details of the contact us added
   * @memberof CategoryController
   */
  static async deleteCategory (req, res, next) {
    const session = await db.startSession()
    session.startTransaction()
    try {
      const templateQuery1 = await Template.deleteMany({ ancestorsIds: { $all: [req.params.id] } })
      const categoryQuery1 = await Category.deleteMany({ ancestorsIds: { $all: [req.params.id] } })
      const categoryQuery2 = await Category.deleteOne({ _id: req.params.id })
      const category = await Category.findById({ _id: req.params.id })
      const subCategory = await Category.find({ ancestorsIds: { $all: [req.params.id] } })
      const template = await Template.find({ ancestorsIds: { $all: [req.params.id] } })
      session.commitTransaction()
      return successResponse(res, {
        message: DELETE_CATEGORY_SUCCESS,
        data: {
          templateQuery1,
          categoryQuery1,
          categoryQuery2,
          category,
          subCategory,
          template
        }
      })
    } catch (e) {
      session.abortTransaction()
      const dbError = new DBError({
        status: DELETE_CATEGORY_ERROR,
        message: e.message
      })
      moduleErrLogMessager(dbError)
      next(new ApiError({ message: DELETE_CATEGORY_ERROR }))
    } finally {
      session.endSession()
    }
  }

  /**
   * Controller used for moving a category to a new category
   * @static
   * @param {Request} req - The request from the endpoint.
   * @param {Response} res - The response returned by the method.
   * @param {Next} next - The next function
   * @returns { JSON } A JSON response containing the details of the contact us added
   * @memberof CategoryController
   */
  static async moveCategoryToNewCategory (req, res, next) {
    const session = await db.startSession()
    session.startTransaction()
    try {
      const queryTemplate1 = await Template.updateMany({
        $and: [
          { ancestorsIds: { $all: [req.category.categoryId, req.category._id] } },
          { categoryId: { $ne: req.category.categoryId } }
        ]
      },
      { $push: { ancestorsIds: req.body.toCategoryId } }
      )
      const queryTemplate2 = await Template.updateMany({
        $and: [
          { ancestorsIds: { $all: [req.category.categoryId, req.category._id] } },
          { categoryId: { $ne: req.category.categoryId } }
        ]
      },
      { $pullAll: { ancestorsIds: [req.category.categoryId] } }
      )
      const queryCategory1 = await Category.updateMany(
        { ancestorsIds: { $all: [req.category.categoryId, req.category._id] } },
        { $push: { ancestorsIds: req.body.toCategoryId } }
      )
      const queryCategory2 = await Category.updateMany(
        { ancestorsIds: { $all: [req.category.categoryId, req.category._id] } },
        { $pullAll: { ancestorsIds: [req.category.categoryId] } }
      )
      const queryCategory3 = await Category.updateOne(
        { _id: req.category._id },
        { $set: { categoryId: req.body.toCategoryId }, $push: { ancestorsIds: req.body.toCategoryId } }
      )
      const queryCategory4 = await Category.updateOne(
        { _id: req.category._id },
        { $pullAll: { ancestorsIds: [req.category.categoryId] } }
      )

      session.commitTransaction()
      return successResponse(res, {
        message: UPDATE_CATEGORY_SUCCESS,
        data: {
          queryTemplate1,
          queryTemplate2,
          queryCategory1,
          queryCategory2,
          queryCategory3,
          queryCategory4
        }
      })
    } catch (e) {
      session.abortTransaction()
      const dbError = new DBError({
        status: UPDATE_CATEGORY_ERROR,
        message: e.message
      })
      moduleErrLogMessager(dbError)
      next(new ApiError({ message: UPDATE_CATEGORY_ERROR }))
    } finally {
      session.endSession()
    }
  }
}

module.exports = CategoryController
