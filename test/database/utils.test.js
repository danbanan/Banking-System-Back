const db = require('../../db/db-module')
const utils = require('../../db/utils')

QUnit.module('/utils/ Testing')

QUnit.test('Utils exists', assert => {
    assert.ok(utils !== null)
})

QUnit.test('Rebuild database', assert => {
    // clear database
    const done = assert.async()
    const query1 = 'SELECT * FROM user_account'
    const query2 = 'SELECT * FROM customer'
    const query3 = 'SELECT * FROM bank_account'
    const query4 = 'SELECT * FROM transaction'

    utils.rebuildDatabase()
        .then(() => db.query(query1))
        .then(() => db.query(query2))
        .then(() => db.query(query3))
        .then(() => db.query(query4))
        .then(() => {
            assert.ok(true, "Database was rebuild")
            done()
        })
        .catch(err => {
            assert.ok(false, "Database was not rebuild")
        })
})

// Test doesn't fail when I leave a table in
// QUnit.test('Database is rebuild', assert => {
//     // clear database
//     const done = assert.async()
//     const query1 = 'SELECT * FROM user_account'
//     const query2 = 'SELECT * FROM customer'
//     const query3 = 'SELECT * FROM bank_account'
//     const query4 = 'SELECT * FROM transaction'

//     utils.clearDatabase()
//         .then(() =>
//         {
//             db.query(query1)
//                 .then(() => {
//                     assert.ok(false, "user_account table still exists")
//                     done()
//                 })

//             db.query(query2)
//                 .then(() => {
//                     assert.ok(false, "customer table still exists")
//                     done()
//                 })
            
//             db.query(query3)
//                 .then(() => {
//                     assert.ok(false, "bank_account table still exists")
//                     done()
//                 })
            
//             db.query(query4)
//                 .then(() => {
//                     assert.ok(false, "transaction table still exists")
//                     done()
//                 })
//         })
//         .then(() => {
//             assert.ok(true, "Database is cleared")
//             done()
//         })
//         .catch(err =>
//         {
//             assert.ok(false, "Failed to delete database")
//             done()
//         })
// })