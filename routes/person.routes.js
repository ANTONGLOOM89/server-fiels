const Router = require('express')
const router = new Router()
const personController = require('../controller/person.controller')



router.get('/person/:id', personController.person)

module.exports = router