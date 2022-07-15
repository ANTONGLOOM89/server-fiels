const Pool = require('pg').Pool
const pool = new Pool({
  user: "anton",
  password: "123456",
  host: "localhost",
  port: "5432",
  database: "cloud_fields"
})

module.exports = pool