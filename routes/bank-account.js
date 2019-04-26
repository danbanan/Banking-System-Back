const express = require('express')
const db = require('../db/db-module')
const VerifyToken = require('../auth/VerifyToken')
const bank_account = require('../db/sql/bank-account-sql')
const user = require('../db/sql/user-account-sql')

const router = module.exports = express.Router()

// Mounts middelware to router so that we can parse URL-encoded bodies (as sent
// by HTML forms) and JSON bodies (as sent by API clients)
router.use(express.urlencoded({extended: true}))
router.use(express.json())

router.put('/close', VerifyToken, (req, res) => 
{
    const account = Object.assign({}, req.body)

    if (!account.hasOwnProperty('account_number'))
    {
        res.json({
            status: 'error',
            message: 'Missing account number'
        })
    }

    db.paramQuery(bank_account.closeAccount, [account.account_number])
        .then(() => 
        {
            res.json({
                status: 'ok',
                message: 'Closing account was successful'
            })
        })
        .catch(err =>
        {
            res.json({
                status: 'error',
                message: 'An error occurred when attempting to close account'
            })
            console.error(err.stack)
        })
})

router.post('/open', VerifyToken, (req, res) => 
{
    const required_fields = new Set([
        'username',
        'account_type'
    ])

    const account = Object.assign({}, req.body)

    for (let field of required_fields) 
    {
        if (!account.hasOwnProperty(field))
        {
            res.json({
                status: 'error',
                message: 'Missing fields'
            })
        }
    }

    // get ssn by username
    db.paramQuery(user.getSsnByUsername, [account.username])
        .then(result =>
        {
            // create new account
            const values = [result.rows[0].ssn, account.account_type]

            db.paramQuery(bank_account.createAccount, values)
                .then(result =>
                {
                    res.json({
                        status: 'ok',
                        message: 'New account number: ' + 
                        result.rows[0].account_number
                    })
                })
        })
        .catch(err =>
        {
            res.json({
                status: 'error',
                message: 'Unable to create new account'
            })
        })
})

