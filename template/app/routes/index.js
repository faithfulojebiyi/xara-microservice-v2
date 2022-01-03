const { Router } = require('express')
const template = require('./template')

const router = Router()
router.use('/template', template)
module.exports = router
