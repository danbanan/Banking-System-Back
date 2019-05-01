const db = require('./db-module')
const bank_account = require('./sql/bank-account-sql')
const customer = require('./sql/customer-sql')
const user_account = require('./sql/user-account-sql')
const transaction = require('./sql/transaction-sql')

const clearDatabase = () => 
{
    return db.query(`DROP TABLE IF EXISTS transaction, bank_account, 
        user_account, customer;`)
}

const createTables = () => 
{
    return db.query(customer.createTable)
        .then(() => db.query(bank_account.createTable))
        .then(() => db.query(user_account.createTable))
        .then(() => db.query(transaction.createTable))
}

const populateTables = () => 
{
    return db.query(customer.populate)
        .then(() => db.query(bank_account.populate))
}

const rebuildDatabase = () => 
{
    return clearDatabase()
        .then(() => createTables())
        .then(() => populateTables())
        .catch(e => console.log('Error rebuilding database on ' + e.stack))
}

module.exports = {
    rebuildDatabase,
    clearDatabase
}