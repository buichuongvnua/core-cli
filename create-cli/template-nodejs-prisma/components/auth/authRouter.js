const express = require('express')
const router = express.Router()
const authorizeMiddleware = require('../../middleware/auth')
const authController = require('./authController')

router.route('/login').post(authController.login)
router.route('/refresh').post(authController.refreshToken)
router.route('/logout').post(authorizeMiddleware(), authController.logout)
router.route('/me').get(authorizeMiddleware(), authController.me)

module.exports = router
