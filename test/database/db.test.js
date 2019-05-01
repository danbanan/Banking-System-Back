require('dotenv').config()
const { Pool } = require('pg')

QUnit.module('Database Testing');
QUnit.test('Remote connection credentials are valid', assert => {
  const pool = new Pool({
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
      pool.end()
    }
    assert.ok(true, "Connection was successful")
    connectionDone()
    pool.end()
  })
})

// Make test for when the connection credentials are invalid
QUnit.test('Remote connection credentials are invalid', assert => {
  const pool = new Pool({
      user: 'bad-user',
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: 'bad-password',
      port: process.env.DB_PORT
  })
  const connectionDone = assert.async()
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      assert.ok(true, "Connection failed")
      connectionDone()
      pool.end()
    } else {
      assert.ok(false, "Connection was successful")
      connectionDone()
      pool.end
    }
  })
})
