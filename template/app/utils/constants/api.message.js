const config = require('../../../config/env')

const {
  XARA_BASE_URL,
  NODE_ENV,
  PORT
} = config

const BASE_URL = NODE_ENV === 'production'
  ? XARA_BASE_URL
  : `http://localhost:${PORT || 5003}`

module.exports = {
  INTERNAL_SERVER_ERROR: 'Oops, something broke on the server!!!',
  NOT_FOUND_API: 'Oops, You have reached a dead end',
  INVALID_PERMISSION: 'Permission denied. Current user does not have the required permission to access this resource.',
  INVALID_CREDENTIALS: 'Incorrect login details',
  ACCESS_REVOKED: 'Your access has been revoked',
  AUTH_REQUIRED: 'Access denied,a valid access token is required',
  UNAUTHORIZED: 'Unauthorised Access to this resource',
  BASE_URL,
  DB_ERROR_STATUS: 'DB_PROCESS_FAILED',
  MODULE_ERROR_STATUS: 'MODULE_PROCESS_BROKE',
  SUCCESS: 'success',
  SUCCESS_RESPONSE: 'Request was successfully processed',
  FAIL: 'fail',
  WELCOME: 'Thanks for dropping by, you are at xara template service',
  v1: '/api/v1',
  GENERIC_ERROR: 'Sorry, something went wrong',
  DB_ERROR: 'A database error occurred, either in mongodb',
  MODULE_ERROR: 'A module error occurred',
  CREATE_TEMPLATE_SUCCESS: 'Created template successfully',
  CREATE_TEMPLATE_ERROR: 'Error creating template',
  DELETE_TEMPLATE_ERROR: 'Error deleting template',
  DELETE_TEMPLATE_SUCCESS: 'Deleted template successfully',
  UPDATE_TEMPLATE_SUCCESS: 'Updated template successfully',
  UPDATE_TEMPLATE_ERROR: 'Error updating template',
  FETCH_TEMPLATE_SUCCESS: 'Fetched template successfully',
  FETCH_TEMPLATE_ERROR: 'Error fetching template',
  TEMPLATE_NOT_FOUND: 'Template not found',
  CREATE_CATEGORY_SUCCESS: 'Created category successfully',
  CREATE_CATEGORY_ERROR: 'Error creating category',
  DELETE_CATEGORY_SUCCESS: 'Deleted category successfully',
  DELETE_CATEGORY_ERROR: 'Error deleting category',
  UPDATE_CATEGORY_SUCCESS: 'Updated category successfully',
  UPDATE_CATEGORY_ERROR: 'Error updating category',
  FETCH_CATEGORY_SUCCESS: 'Fetched category successfully',
  FETCH_CATEGORY_ERROR: 'Error fetching category',
  CATEGORY_NOT_FOUND: 'Category not found',
  RESOURCE_EXIST_VERIFICATION_FAIL: (resource) => `${resource}_EXIST_VERIFICATION_FAIL`,
  PARAM_ABSENT: (schema) => `Please provide a valid ${schema}`
}
