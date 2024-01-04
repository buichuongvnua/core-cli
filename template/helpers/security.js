const crypto = require('crypto')

const generateSalt = (rounds = 12) => {
  return crypto
    .randomBytes(Math.ceil(rounds / 2))
    .toString('hex')
    .slice(0, rounds)
}

const _hasher = (password, salt) => {
  let hashValue = crypto.createHmac('sha512', salt)
  hashValue.update(password)
  let value = hashValue.digest('hex')
  return value
}

const hash = (password, salt) => {
  if (password == null || salt == null) {
    throw new Error('Must Provide Password and salt values')
  }
  if (typeof password !== 'string' || typeof salt !== 'string') {
    throw new Error(
      'password must be a string and salt must either be a salt string or a number of rounds',
    )
  }
  return _hasher(password, salt)
}

const compare = (password, hashValue, salt) => {
  if (password == null || hashValue == null) {
    throw new Error('password and hash is required to compare')
  }
  if (
    typeof password !== 'string' ||
    typeof hashValue !== 'string' ||
    typeof salt !== 'string'
  ) {
    throw new Error('password must be a String and hash must be an String')
  }
  let passwordHash = _hasher(password, salt)
  if (passwordHash === hashValue) {
    return true
  }
  return false
}

module.exports = {
  generateSalt,
  hash,
  compare,
}
