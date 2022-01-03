const { Router } = require('express')
const category = require('./category')

const router = Router()

router.use('/category', category)
module.exports = router
