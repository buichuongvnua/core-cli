const express = require('express')
const router = express.Router()
const {name}Controller = require('./{name}Controller')
const paginationMiddleware = require('../../middleware/pagination')
const authorizeMiddleware = require('../../middleware/auth')

router
  .route('/{name}s/')
  .get(authorizeMiddleware(), paginationMiddleware, {name}Controller.list)
  .post(authorizeMiddleware(), {name}Controller.create)

router
  .route('/{name}s/:id/')
  .get(authorizeMiddleware(), {name}Controller.get)
  .put(authorizeMiddleware(), {name}Controller.update)
  .delete(authorizeMiddleware(), {name}Controller.del)

module.exports = router
