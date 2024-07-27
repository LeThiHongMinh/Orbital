const { Pool } = require('pg')
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

const connect = async () => {
  const client = await pool.connect();
  return client;
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  connect: connect, 
}
