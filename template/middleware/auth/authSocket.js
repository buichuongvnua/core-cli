const jwt = require('jsonwebtoken')
const { ACCESS_TOKEN_SECRET_KEY } = require('../../config')

const authSocket = (socket, next) => {
  const query = socket.handshake.query
  if (!query) {
    next(Error('Not authorized to access this resource'))
  }
  if (!query.token) {
    next(Error('Not authorized to access this resource'))
  }
  const token = query.token
  try {
    jwt.verify(token, ACCESS_TOKEN_SECRET_KEY)
    next()
  } catch (error) {
    next(Error('Not authorized to access this resource'))
  }
}
module.exports = authSocket
