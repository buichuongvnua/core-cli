const prisma = require('../../prisma')
const { BadRequest, Unauthorized } = require('../../helpers/error')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')

const { compare } = require('../../helpers/security')
const {
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_EXPIRES_IN,
} = require('../../config')
const { addSession } = require('../../helpers/service/redisService')

const login = async ({ user_name, password }) => {
  const user = await prisma.users.findFirst({
    where: { user_name: user_name },
  })
  if (!user) {
    throw new BadRequest('Thông tin đăng nhập không chính xác')
  }
  if (user.is_suspended) {
    throw new BadRequest('Tài khoản chưa được kích hoạt')
  }
  if (user.is_deleted) {
    throw new BadRequest('Tài khoản đã bị xóa')
  }

  const isValid = compare(password, user.password)
  if (!isValid) {
    throw new BadRequest('Tên đăng nhập hoặc mật khẩu không chính xác')
  }
  const session_access_id = uuidv4()
  const session_refresh_id = uuidv4()
  const accessToken = jwt.sign(
    {
      id: user.id,
      session_access_id,
    },
    ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
  )
  const refreshToken = jwt.sign(
    { id: user.id, session_refresh_id },
    REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    },
  )
  await addSession({
    id: user.id,
    session_access_id,
    session_refresh_id,
    expired_access_second: 0,
    expired_refresh_second: 0,
  })

  const response = {
    accessToken,
    refreshToken,
  }
  return response
}

const refreshToken = async ({ refreshToken }) => {
  const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY)
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: {
      role: true,
    },
  })
  if (!user) {
    throw new Unauthorized('Token expired')
  }
  const token = jwt.sign(
    {
      userId: user.id,
      roleCode: user.role.code,
      roleId: user.role.id,
      username: user.username,
    },
    ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
  )
  return { token }
}

const forgotPassword = async ({ email }) => {
  const user = await prisma.user.findUnique({ where: { username: email } })
  if (!user) {
    throw new BadRequest('Cannot reset password')
  }

  const token = jwt.sign(
    {
      id: user.id,
    },
    SECRET_KEY_RESET_PASSWORD,
    { expiresIn: 10 * 60 * 1000 },
  )
}

module.exports = {
  login,
  refreshToken,
  forgotPassword,
}
