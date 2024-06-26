const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'orbital',
  password: 'Hm:200605',
  port: 5432,
})

const connect = async () => {
  const client = await pool.connect();
  return client;
};

module.exports = {
  query: (text, params) => pool.query(text, params),
}