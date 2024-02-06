const { BadRequest } = require('../../helpers/error')
const compassService = require('./compassService')

const list = async function (req, res, next) {
  try {
    const { search } = req.query
    const pagination = req.pagination
    const response = await compassService.list({
      search,
      pagination,
    })
    return res.send(response)
  } catch (error) {
    next(error)
  }
}

const get = async (req, res, next) => {
  try {
    let id = req.params.id
    if (!id) {
      throw new BadRequest('Param invalid')
    }
    id = Number(id)
    const response = await compassService.get(id)
    return res.send(response)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const response = await compassService.create(req.body)
    return res.send(response)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    let id = req.params.id
    if (!id) {
      throw new BadRequest('Param invalid')
    }
    id = Number(id)
    const user = await compassService.update({
      id,
      ...req.body,
    })
    return res.send({ id: user.id })
  } catch (error) {
    next(error)
  }
}

const del = async (req, res, next) => {
  try {
    let id = req.params.id
    if (!id) {
      throw new BadRequest('Param invalid')
    }
    id = Number(id)
    const response = await compassService.del({ id })
    return res.send(response)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  list,
  get,
  create,
  update,
  del,
}
