const knex = require('knex')
let configDefault = require('../knexfile')

const types = require('pg').types
const parseDecimal = function (val) {
  return val === null ? 0 : parseFloat(val)
}
types.setTypeParser(types.builtins.NUMERIC, parseDecimal)

module.exports = knex(configDefault)
