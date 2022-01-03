const Template = require('../../models/template')

/**
 * Contains a collection of service methods for managing Template resource on the app.
 * @class TemplateService
 */
class TemplateService {
  /**
   * Fetches the use by id
   * @param {string} id - Th template id to be fetched
   * @returns {Promise<Array<Template> | Error> } - A promise that resolves or rejects
   * witj the template resource of DB Error
   */
  static getTemplateById (id) {
    return Template.findById({ _id: id })
  }
}

module.exports = TemplateService
