const Category = require('../../models/category')

/**
 * Contains a collection of service methods for managing Category resource on the app.
 * @class CategoryService
 */
class CategoryService {
  /**
   * Fetches the use by id
   * @param {string} id - Th category id to be fetched
   * @returns {Promise<Array<Category> | Error> } - A promise that resolves or rejects
   * witj the category resource of DB Error
   */
  static getCategoryById (id) {
    return Category.findById({ _id: id })
  }
}

module.exports = CategoryService
