const Router = require('express')
const router = new Router()
const fileController = require('../controller/file.controller')



router.post('/files', fileController.createDir)
router.get('/files/:id', fileController.getFiles)

module.exports = router