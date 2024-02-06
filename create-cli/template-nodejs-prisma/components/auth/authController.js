const { BadRequest } = require('../../helpers/error')
const userService = require('./authService')

const login = async function (req, res, next) {
  try {
    const { userName, password } = req.body
    const response = await userService.login({
      userName,
      password,
    })
    return res.send(response)
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { refreshToken } = req.body
    const response = await userService.refreshToken({
      token: refreshToken,
      userId,
    })
    return res.send(response)
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const response = await userService.refreshToken(req.body)
    return res.send(response)
  } catch (error) {
    next(error)
  }
}

const register = async (req, res, next) => {
  try {
    const response = await userService.register(req.body)
    return res.send(response)
  } catch (error) {
    next(error)
  }
}

const verify = async (req, res, next) => {
  try {
    const response = await userService.login({ token, userId })
    return res.send(response)
  } catch (error) {
    next(error)
  }
}

const forgotPassword = async (req, res, next) => {
  try {
    let { email } = req.body
    const response = await userService.forgotPassword({ token, userId })
    return res.send(response)
  } catch (error) {
    next(error)
  }
}

const resetPassword = async (req, res, next) => {
  try {
    const response = await userService.login({ token, userId })
    return res.send(response)
  } catch (error) {
    next(error)
  }
}

const me = async (req, res, next) => {
  try {
    const response = await userService.me(req.user)
    return res.send(response)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  login,
  logout,
  verify,
  register,
  refreshToken,
  forgotPassword,
  resetPassword,
  me,
}
