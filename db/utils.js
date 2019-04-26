const db = require('./db-module')
const bank_account = require('./sql/bank-account-sql')
const customer = require('./sql/customer-sql')
const user_account = require('./sql/user-account-sql')

const clearDatabase = () => 
{
    return db.queryPromise(`DROP TABLE IF EXISTS bank_account, user_account, 
        customer;`)
}

const createTables = () => 
{
    return db.queryPromise(customer.createTable)
        .then(() => db.queryPromise(bank_account.createTable))
        .then(() => db.queryPromise(user_account.createTable))
}

const populateTables = () => 
{
    return db.queryPromise(customer.populate)
        .then(() => db.queryPromise(bank_account.populate))
}

const rebuildDatabase = () => 
{
    return clearDatabase()
        .then(() => createTables())
        .then(() => populateTables())
        .catch(e => console.log('Error rebuilding database on ' + e.stack))
}

module.exports = {
    rebuildDatabase
}