const Router = require('express')
const router = new Router()
const authController = require('../controller/auth.controller')
const { check } = require('express-validator')

function validationRules() {
    return [
        check('email', 'Your email is not valid').not().isEmpty()
    ]
}

router.post('/auth/register', validationRules(), authController.register)
router.post('/auth/login', authController.login)

module.exports = router