const { Router } = require('express')
const { templateSchema } = require('../validations/template')
const { ValidationMiddleware, CategoryMiddleware } = require('../middlewares')
const TemplateController = require('../controllers/template')

const { validate } = ValidationMiddleware
const { CheckCategoryId, createAncestors } = CategoryMiddleware
const { createTemplate, getAllTemplates } = TemplateController

const router = Router()

router.post(
  '/create',
  validate(templateSchema),
  CheckCategoryId,
  createAncestors,
  createTemplate
)
router.get(
  '',
  getAllTemplates
)
module.exports = router
