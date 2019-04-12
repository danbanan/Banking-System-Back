require('dotenv').config()
const { Pool } = require('pg')
let pool;

if(process.env.LOCAL && process.env.LOCAL === 'TRUE'){
    // Pool of connections so that we don't have to open a client and close it 
    // every time we make a query
    pool = new Pool()
    console.log('Starting local database')
    pool.on('error', function (err) {
        console.log(err)
    })
} else {
    console.log('Connecting to remote database')
    // in progress...
}

if (process.env.REBUILD_DATA && process.env.REBUILD_DATA === "TRUE") 
{
    const bank_account = require('./sql/bank-account-sql')
    const customer = require('./sql/customer-sql')
    const user_account = require('./sql/user-account-sql')
    const pre_data = require('./sql/pre-data-sql')

    // Starting with dropping all tables
    pool.query(`DROP TABLE IF EXISTS bank_account, user_account, customer;`, 
    (err, result) =>
    {
        if (err) throw err
        // Building database schema, queries are synchronized as customer table 
        // is referencing bank_account and user_account
        pool.query(bank_account.createTable, (err, result) => {
            if (err) throw err
            // // Inserting pre bank_account data
            pool.query(pre_data.bank_account, (err, result) =>{
                if (err) throw err
            })
            pool.query(customer.createTable, (err, result) => {
                // Inserting pre customer data
                if(err) throw err
                pool.query(user_account.createTable, (err, result) =>
                {
                    if (err) throw err
                    console.log('Finished building database')
                })
            })
        })
    })
}
  
// Close database connections on exit
const closeDBConnections = () => {
    console.log('calling end')
    pool.end()
    process.exit(1);
};
  
process.on('SIGINT', closeDBConnections);
process.on('SIGTERM', closeDBConnections);

const getUserByCredentials = (req, res) =>
{
    const { user_name, password } = req.body

    pool.query(`SELECT * FROM user_account WHERE user_name = '${user_name}' AND 
    pswd_hash = '${password}'`, (err, result) =>
    {
        if(err) throw err
        res.status(200).json(result.rows)
    })
}

const updatePassword = (req, res) =>
{
    const { user_name, password, new_pswd } = req.body
    // check old password here
    pool.query(`UPDATE user_account SET pswd_hash = '${new_pswd}' WHERE 
    user_name = '${user_name}'`, (error, result) =>
    {
        if(error) throw error
        res.status(200).send('Password is changed')
    })
}

const deleteUser = (req, res) =>
{
    const user_name = req.params.user_name

    pool.query(`DELETE FROM user_account WHERE user_name = '${user_name}'`, 
    (error, result) => 
    {
        if(error) throw error
        res.status(200).send(`User deleted with user name ${user_name}`)
    })
}

module.exports = {
    getUserByCredentials,
    updatePassword,
    deleteUser,
    // query promise
    query: (text, callback) => { return pool.query(text, callback) },
}