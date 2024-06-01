const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

module.exports = {
  query: (text, params) => pool.query(text, params),
}