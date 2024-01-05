class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}
class BadRequest extends ErrorHandler {
  constructor(message, details) {
    super(400, message)
    this.details = details
  }
}

class Unauthorized extends ErrorHandler {
  constructor(message) {
    super(401, message)
  }
}

class Forbidden extends ErrorHandler {
  constructor(message) {
    super(403, message)
  }
}
class NotFound extends ErrorHandler {
  constructor(message) {
    super(404, message)
  }
}
class InternalError extends ErrorHandler {
  constructor(message) {
    super(500, message)
  }
}

class OutOfCoinError extends ErrorHandler {
  constructor(error) {
    super(error.message)
    this.statusCode = 400
    this.code = 'OutOfQCoin'
  }
}

module.exports = {
  BadRequest,
  Unauthorized,
  NotFound,
  Forbidden,
  InternalError,
  OutOfCoinError,
}
