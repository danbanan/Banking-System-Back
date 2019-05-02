const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const moment = require('moment');
const db = require('../db/db-module')
const user_account = require('../db/sql/user-account-sql')
const customer = require('../db/sql/customer-sql')
const VerifyToken = require('../auth/VerifyToken')


const router = module.exports = express.Router()

// Mounts middelware to router so that we can parse URL-encoded bodies (as sent
// by HTML forms) and JSON bodies (as sent by API clients)
router.use(express.urlencoded({extended: true}))
router.use(express.json())

// localhost:3000/user/register

router.post('/register', (req, res) => 
{
    // send confirmation email, nice to have

    const required_fields = new Set([
        'username',
        'password',
        'ssn'
    ])

    const user = Object.assign({}, req.body)

    for (let field of required_fields)
    {
        if (!user.hasOwnProperty(field))
        {
            res.json({
                status: 'error',
                message: 'missing fields'
            })
        }
    }

    db.paramQuery(user_account.getUserByUsername, [user.username])
        .then(result => 
        {
            // is username already taken?
            if(result.rows.length == 0) 
            {
                db.paramQuery(customer.getCustomerBySsn, [user.ssn])
                    .then(result => 
                    {
                        // is the person a customer?
                        if(result.rows.length > 0) 
                        {
                            bcrypt.hash(user.password, 12, (err, hash) => 
                            {
                                const values = [user.username, hash, user.ssn]
                                db.paramQuery(user_account.createUser, values)
                                .then(result => 
                                {
                                    res.json({
                                        status: 'ok',
                                        message: result.rows[0].username
                                    })
                                })
                            })
                        } else {
                            res.json({
                                status: 'error',
                                message: 'Invalid SSN'
                            })
                        }
                    })
            } else {
                res.json({ 
                    status: 'error',
                    message: 'Username already exists'
                })
            }
        })
        .catch(err => console.error(err.stack))
})

router.post('/login', (req, res) =>
{
    const required_fields = new Set([
        'username',
        'password'
    ])

    const user = Object.assign({}, req.body)
    
    for (let field of required_fields) 
    {
        if (!user.hasOwnProperty(field))
        {
            res.json({
                status: 'error',
                message: 'Missing user data'
            })
        }
    }

    // verify user
    db.paramQuery(user_account.getPswdByUsername, [user.username])
        .then(result => 
        {
            if(result.rows.length > 0) 
            {
                // verify password
                bcrypt.compare(user.password, result.rows[0].pswd_hash, 
                    (err, result) =>
                {
                    if(result)
                    {
                        const secret = process.env.SECRET
                        var token = jwt.sign({ id: user.username }, secret, {
                            expiresIn: 86400 // expires in 24 hours
                        })
                        let expireDate = moment()
                        expireDate.add(86400, 's')
                        res.json({
                            status: 'ok',
                            message: "Login successful",
                            username: user.username,
                            token: token,
                            expiresIn: expireDate.format('LLL')
                        })
                    } else {
                        res.json({
                            status: 'error',
                            message: "Wrong password"
                        })
                    }
                })
            } else {
                res.json({
                    status: "error",
                    message: "Username does not exist"
                })
            }
        })
    .catch(err => console.error(err.stack))
})

// testing route for VerifyToken
router.get('/me', VerifyToken, (req, res) =>
{
    res.json({
        status: 'ok',
        message: req.username
    })
})

// The logout endpoint is not needed. The act of logging out can solely be done 
// through the client side. A token is usually kept in a cookie or the browser’s
// localstorage. Logging out is as simple as destroying the token on the client.

// User account management...
// router.delete('/user/:id', db.deleteUser)