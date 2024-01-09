const { DATABASE_URL } = require('./config')

module.exports = {
  client: 'postgresql',
  pool: {
    min: 1,
    max: 50,
  },
  acquireConnectionTimeout: 100000,
  migrations: {
    tableName: 'knex_migrations',
    directory: __dirname + '/db/migrations',
  },
  seeds: {
    seeds: { directory: __dirname + '/db/seeds' },
  },
  connection: DATABASE_URL,
}
