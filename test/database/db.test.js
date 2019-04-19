require('dotenv').config()
const { Pool } = require('pg')
let pool;

QUnit.module('Database Testing');
QUnit.test('Remote connection credentials are valid', assert => {
  pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT
  })
  const connectionDone = assert.async()
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      assert.ok(false, "Connection failed")
      connectionDone()
    }
    assert.ok(true, "Connection was successful")
    connectionDone()
  })
})

// Make test for when the connection credentials are invalid
