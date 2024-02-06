const express = require('express')
const router = express.Router()
const compassController = require('./compassController')
const paginationMiddleware = require('../../middleware/pagination')
const authorizeMiddleware = require('../../middleware/auth')

router
  .route('/compass/')
  .get(authorizeMiddleware(), paginationMiddleware, compassController.list)
  .post(authorizeMiddleware(), compassController.create)

router
  .route('/compass/:id(\\d+)/')
  .get(authorizeMiddleware(), compassController.get)
  .put(authorizeMiddleware(), compassController.update)
  .delete(authorizeMiddleware(), compassController.del)

module.exports = router
