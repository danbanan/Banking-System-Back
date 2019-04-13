require('dotenv').config()
const { Pool } = require('pg')
let pool;

QUnit.module("Database Testing");
QUnit.test("Remote connection credentials are valid", assert => {
  pool = new Pool({
      user: process.env.USER,
      host: process.env.HOST,
      database: process.env.DATABASE,
      password: process.env.PASSWORD,
      port: process.env.PORT
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
