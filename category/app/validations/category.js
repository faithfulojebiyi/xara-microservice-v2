const Joi = require('joi')

const { ValidationHelper } = require('../utils/helpers')

const { stringCheck } = ValidationHelper

const categorySchema = Joi.object({
  displayName: stringCheck('Display Name', Joi),
  categoryId: Joi.any()
})

const moveCategorySchema = Joi.object({
  toCategoryId: stringCheck('To Category Id', Joi)
})

module.exports = {
  categorySchema,
  moveCategorySchema
}
