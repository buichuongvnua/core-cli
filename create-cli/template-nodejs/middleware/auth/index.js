const jwt = require('jsonwebtoken')
const { Unauthorized } = require('../../helpers/error')
const { ACCESS_TOKEN_SECRET_KEY } = require('../../config')

module.exports = () => {
  return async (req, res, next) => {
    try {
      const authorization = req.headers['authorization']
      const messageError = 'cannot access protected route'
      if (!authorization) {
        throw new Unauthorized(messageError)
      }
      const token = authorization.substring('Bearer '.length)
      let user
      try {
        user = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY)
        console.log(user)
        req.user = user
      } catch (error) {
        throw new Unauthorized(messageError)
      }
      return next()
    } catch (error) {
      return next(error)
    }
  }
}
