const db = require('../../db/db-module')
const utils = require('../../db/utils')

QUnit.module('/utils/ Testing')

QUnit.test('Utils exists', assert => {
    assert.ok(utils !== null)
})

QUnit.test('Clear database of all tables', assert => {
    // clear database
})

QUnit.test('Create tables for database', assert => {
    // clear database first, then create tables
})

QUnit.test('Populate tables', assert => {
    // clear tables first, create tables second, populate tables third
})