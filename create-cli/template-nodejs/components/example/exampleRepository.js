const knex = require('../../helpers/knex')

const insert = async (model) => {
  return await knex('{name}').insert(model)
}

const update = async (model) => {
  return await knex('{name}').update(model).where({ id: model.id })
}

const del = async ({ id }) => {
  return await knex('{name}').where({ id }).del()
}

const count = async ({ search, from, to }) => {
  let query = knex('{name}')
  if (search) {
    query.where('name', search)
  }
  if (from) {
    query.where('created_at', '>', from)
    query.where('created_at', '<', to)
  }
  const result = await query.count('id')
  return parseInt(result[0].count)
}

const select = async ({ search, from, to, limit, offset }) => {
  let query = knex('{name}')
  if (search) {
    query.where('name', search)
  }
  if (from) {
    query.where('created_at', '>', from)
    query.where('created_at', '<', to)
  }
  return await query
    .orderBy('updated_at', 'desc')
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select()
}

const first = async(model)=> {
  return await knex('{name}').where(model).select().first()
}

module.exports = {
  select,
  insert,
  update,
  del,
  count,
  first,
}
