const Joi = require('joi')

const { ValidationHelper } = require('../utils/helpers')

const { stringCheck } = ValidationHelper

const templateSchema = Joi.object({
  displayName: stringCheck('Display Name', Joi, 3),
  categoryId: Joi.any()
})

module.exports = {
  templateSchema
}
