const PORT = process.env.PORT
const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY || '112233'
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY || '111'
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || 360000000
const REFRESH_TOKEN_EXPIRES_IN =
  process.env.REFRESH_TOKEN_EXPIRES_IN || 86400000
const SECRET_KEY_RESET_PASSWORD = process.env.SECRET_KEY_RESET_PASSWORD || '111'
const REDIS_URL = process.env.REDIS_URL

module.exports = {
  PORT,
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  SECRET_KEY_RESET_PASSWORD,
  REDIS_URL,
}
