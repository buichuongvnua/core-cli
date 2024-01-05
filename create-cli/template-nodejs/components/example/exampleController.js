const { BadRequest } = require('../../helpers/error')
const {name}Service = require('./{name}Service')

const list = async function (req, res, next) {
  try {
    const { search } = req.query
    const pagination = req.pagination
    const response = await {name}Service.list({
      search,
      pagination,
    })
    return res.send(response)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const response = await {name}Service.create(req.body)
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
    const user = await {name}Service.update({
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
    const res = await {name}Service.delete({
      id,
    })
    return res.send(res)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  list,
  create,
  update,
  del
}
