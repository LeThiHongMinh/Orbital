const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'testinglocal',
  password: '18062005',
  port: 5432,
})

module.exports = {
  query: (text, params) => pool.query(text, params),
}