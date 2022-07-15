const Router = require('express')
const router = new Router()
const authController = require('../controller/auth.controller')

router.post('auth/register', authController.register)

module.exports = router