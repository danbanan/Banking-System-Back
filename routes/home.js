const express = require('express')
const db = require('../db/db-module')
const VerifyToken = require('../auth/VerifyToken')
const bank_account = require('../db/sql/bank-account-sql')
const user_account = require('../db/sql/user-account-sql')

const router = module.exports = express.Router()

router.use(express.urlencoded({extended: true}))
router.use(express.json())

router.get('/', VerifyToken, (req, res) =>
{
    db.paramQuery(user_account.getSsnByUsername, [req.username])
        .then(result =>
        {
            const ssn = result.rows[0].ssn

            db.paramQuery(bank_account.getOpenAccounts, [ssn])
                .then(result =>
                {
                    res.json({
                        status: 'ok',
                        message: result.rows
                    })
                })
        })
        .catch(err =>
        {
            console.error(err)
            res.json({
                status: 'ok',
                message: 'Unable to get accounts'
            })
        })
})