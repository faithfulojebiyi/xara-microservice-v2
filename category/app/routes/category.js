const { Router } = require('express')
const { categorySchema, moveCategorySchema } = require('../validations/category')
const { ValidationMiddleware, CategoryMiddleware } = require('../middlewares')
const CategoryController = require('../controllers/category')

const { validate } = ValidationMiddleware
const { CheckCategoryId, createAncestors, checkToCategory } = CategoryMiddleware
const { createCategory, getAllCategories, moveCategoryToNewCategory, deleteCategory } = CategoryController
const router = Router()

router.post(
  '/create',
  validate(categorySchema),
  CheckCategoryId,
  createAncestors,
  createCategory
)

router.get(
  '',
  getAllCategories
)

router.patch(
  '/move/:id',
  validate(moveCategorySchema),
  CheckCategoryId,
  checkToCategory,
  moveCategoryToNewCategory
)

router.delete(
  '/:id',
  CheckCategoryId,
  deleteCategory
)

module.exports = router
