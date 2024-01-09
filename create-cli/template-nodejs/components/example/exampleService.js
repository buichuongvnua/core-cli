const { BadRequest } = require('../../helpers/error')
const { paginationBuilder, dataBuilder } = require('../../helpers/response')
const {name}Repository = require('./{name}Repository')

const list = async ({ search, from, to, limit, offset }) => {
  const total = await {name}Repository.count({ search, from, to })
  const items = await {name}Repository.select(search, from, to, limit, offset)

  return paginationBuilder(items, total)
}

const create = async (payload) => {
  const item = await {name}Repository.insert(payload)
  return dataBuilder(item)
}

const update = async (payload) => {
  const item = await {name}Repository.first({ id: payload.id })
  if (!item) {
    throw new BadRequest('Item not found')
  }
  await {name}Repository.update(model)
}

const del = async (payload) => {
  const item = await {name}Repository.first({ id: payload.id })
  if (!item) {
    throw new BadRequest('Item not found')
  }
  await await {name}Repository.del(model)
}

const get = async (payload) => {
  const item = await {name}Repository.first({ id: payload.id })
  if (!item) {
    throw new BadRequest('Item not found')
  }
  return dataBuilder(item)
}

module.exports = {
  list,
  create,
  update,
  del,
  get,
}
