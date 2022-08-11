const Router = require('express')
const router = new Router()
const fileController = require('../controller/file.controller')



router.post('/files', fileController.createDir)

module.exports = router