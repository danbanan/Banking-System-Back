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

// get all open bank accounts

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
    const account = Object.assign({ username: req.username }, req.body)
    
    if (!account.hasOwnProperty('account_type'))
    {
        res.json({
            status: 'error',
            message: 'Missing account type'
        })
    }

    // get ssn by username
    db.paramQuery(user.getSsnByUsername, [account.username])
        .then(result =>
        {
            if (result.rows.length > 0) 
            {
                // create new account
                const values = [result.rows[0].ssn, account.account_type]
    
                db.paramQuery(bank_account.createAccount, values)
                    .then(result =>
                    {
                        res.json({
                            status: 'ok',
                            message: result.rows[0].account_number
                        })
                    })
            } 
            else {
                res.json({
                    status: 'error',
                    message: 'User does not exist'
                })
            }
        })
        .catch(err =>
        {
            res.json({
                status: 'error',
                message: 'Unable to open new bank account'
            })
        })
})

router.post('/deposit', VerifyToken, (req, res) =>
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
        .then(result =>
        {
            values = [account.account_number, account.amount, 
                result.rows[0].balance, account.description]

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

router.post('/withdrawal', VerifyToken, (req, res) =>
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
                    .then(result =>
                    { 
                        values = [account.account_number, account.amount*(-1), 
                            result.rows[0].balance, account.description]

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

router.post('/transfer', VerifyToken, (req, res) =>
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

    db.paramQuery(bank_account.getBalance, [account.source])
        .then(result =>
        {
            if (result.rows[0].balance > account.amount) 
            {
                db.paramQuery(bank_account.makeWithdrawal, [account.amount, 
                        account.source])
                    .then(result =>
                    {
                        let description = 'Transaction from ' + account.source
                            + ' to ' + account.destination

                        let values = [account.source, account.amount*(-1), 
                            result.rows[0].balance, description]

                        db.paramQuery(transaction.updateHistory, values)
                            .then(() =>
                            {
                                db.paramQuery(bank_account.makeDeposit, 
                                    [account.amount, account.destination])
                                    .then(result =>
                                    {
                                        values = [account.destination, 
                                            result.rows[0].balance, 
                                            account.amount, description]
                                        
                                        db.paramQuery(transaction.updateHistory, 
                                            values)
                                            .then(() =>
                                            {
                                                res.json({
                                                    status: 'ok',
                                                    message: 'Transaction was successful'
                                                })
                                            })
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
})

router.get('/', VerifyToken, (req, res) => 
{
    const account = Object.assign({}, req.body)
    
    if (!account.hasOwnProperty('account_number'))
    {
        return res.json({
            status: 'error',
            message: 'Missing field'
        })
    }
    db.paramQuery(bank_account.getBankAccount, [account.account_number])
        .then(result =>
        {
            account_info = [result.rows[0]]
            db.paramQuery(bank_account.getTransactions, [account.account_number])
                .then(result =>
                    {
                        // sends list with bank info first, then transactions
                        res.json({
                            status: 'ok',
                            message: account_info.concat(result.rows)
                        })
                    })
        })
        .catch(error =>
        {
            console.error(error)
            res.json({
                status: 'error',
                message: 'Unable to get account information'
            })
        })
})