const express = require('express')
const db = require('../db/db-module')
const VerifyToken = require('../auth/VerifyToken')
const bank_account = require('../db/sql/bank-account-sql')
const user = require('../db/sql/user-account-sql')
const transaction = require('../db/sql/transaction-sql')

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

router.put('/deposit', VerifyToken, (req, res) =>
{
    const required_fields = new Set([
        'account_number',
        'amount',
        'description'
    ])

    const account = Object.assign({}, req.body)

    for (let field of required_fields) 
    {
        if (!account.hasOwnProperty(field))
        {
            return res.json({
                status: 'error',
                message: 'Missing fields'
            })
        }
    }

    let values = [account.amount, account.account_number]

    db.paramQuery(bank_account.makeDeposit, values)
        .then(() =>
        {
            values = [account.account_number, account.amount, 
                account.description]

            db.paramQuery(transaction.updateHistory, values)
                .then(() =>
                {
                    res.json({
                        status: 'ok',
                        message: 'Deposit was successful'
                    })
                })
        })
        .catch(err => 
        {
            console.error(err)
            res.json({
                status: 'error',
                message: 'Unable to make deposit'
            })
        })
})

router.put('/withdrawal', VerifyToken, (req, res) =>
{
    const required_fields = new Set([
        'account_number',
        'amount',
        'description'
    ])

    const account = Object.assign({}, req.body)

    for (let field of required_fields) 
    {
        if (!account.hasOwnProperty(field))
        {
            return res.json({
                status: 'error',
                message: 'Missing fields'
            })
        }
    }

    // get balance
    db.paramQuery(bank_account.getBalance, [account.account_number])
        .then(result =>
        {
            if (result.rows[0].balance > account.amount) {
                // make withdrawal
                let values = [account.amount, account.account_number]
                db.paramQuery(bank_account.makeWithdrawal, values)
                    .then(() =>
                    {
                        values = [account.account_number, account.amount*(-1), 
                            account.description]

                        // update transaction history                        
                        db.paramQuery(transaction.updateHistory, values)
                            .then(() =>
                            {
                                res.json({
                                    status: 'ok',
                                    message: 'Withdrawal was successful'
                                })
                            })
                    })
            } else {
                res.json({
                    status: 'error',
                    message: 'Insufficient funds'
                })
            }

        })
        .catch(err =>
        {
            console.error(err)
            res.json({
                status: 'error',
                message: 'Unable to make withdrawal'
            })
        })
})

router.put('/transfer', VerifyToken, (req, res) =>
{
    const required_fields = new Set([
        'source',
        'destination',
        'amount'
    ])

    const account = Object.assign({}, req.body)

    for (let field of required_fields) 
    {
        if (!account.hasOwnProperty(field))
        {
            return res.json({
                status: 'error',
                message: 'Missing fields'
            })
        }
    }

    db.paramQuery(bank_account.makeWithdrawal, [account.amount, account.source])
        .then(() =>
        {
            let description = 'Internal transaction to ' + account.destination
            let values = [account.source, account.amount*(-1), description]
            db.paramQuery(transaction.updateHistory, values)
                .then(() =>
                {
                    db.paramQuery(bank_account.makeDeposit, 
                        [account.amount, account.destination])
                        .then(() =>
                        {
                            description = 'Internal transaction from ' + 
                                account.source

                            values = [account.destination, account.amount, 
                                description]
                            
                            db.paramQuery(transaction.updateHistory, values)
                                .then(() =>
                                {
                                    res.json({
                                        status: 'ok',
                                        message: 'Internal transaction successful'
                                    })
                                })
                        })
                })
        })
})

router.get('/account', VerifyToken, (req, res) => 
{
    const account = Object.assign({}, req.body)
    
    if (!account.hasOwnProperty('account_number'))
    {
        return res.json({
            status: 'error',
            message: 'Missing field'
        })
    }

    db.paramQuery(bank_account.getTransactions, [account.account_number])
        .then(result =>
            {
                res.json({
                    status: 'ok',
                    message: result.rows
                })
            })
        .catch(err =>
        {
            console.error(err)
            res.json({
                status: 'error',
                message: 'Unable to get account information'
            })
        })
})