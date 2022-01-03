const { Router } = require('express')
const category = require('./category')
const template = require('./template')

const router = Router()

router.use('/category', category)
router.use('/template', template)
module.exports = router
