const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const moment = require('moment');
const db = require('../db/db-module')
const VerifyToken = require('../auth/VerifyToken')
const user = require('../db/sql/user-account-sql')

const router = module.exports = express.Router()

// Parse URL-encoded bodies (as sent by HTML forms)
router.use(express.urlencoded({extended: true}))
// Parse JSON bodies (as sent by API clients)
router.use(express.json())

// Get register page
router.get('/register', (req, res) => {
    res.status(200).sendFile(__dirname + '/register.html')
})

// Get login page
router.get('/login', (req, res) => { 
    res.status(200).sendFile(__dirname + '/login.html')
})

// localhost:3000/user/register

// Register new user account
router.post('/register', (req, res) =>
{
    // make sure that user has a bank account, verify social security number, 
    // and send confirmation email []

    // expects a json request
    const username = req.body.username
    const password = req.body.password
    const ssn = req.body.ssn

    db.query(user.getUserByUsername(username), (error, result) =>
    {
        if(error) throw error
        // Checking to see if user already exists
        if(result.rows.length == 0)
        {
            // Creating user and storing salt hashed password
            bcrypt.hash(password, 12, (err, hash) =>
            {
                db.query(user.createUser(username, hash), (error, result) =>
                {
                    if(error) throw error
                    res.json({
                        status: "ok",
                        message: 
                        `Created user with username: ${result.rows[0].username}`
                    })
                })
            })
        } 
        else {
            res.json({
                status: "error",
                message: "Username already exists"
            })
        }
    })
})

router.post('/login', (req, res) =>
{
    const username = req.body.username
    const password = req.body.password

    // verify user
    db.query(user.getPswdByUsername(username), (err, result) => 
    {
        if(err) throw err
        if(result.rows.length > 0) {
            // verify password
            bcrypt.compare(password, result.rows[0].pswd_hash, (err, result) =>
            {
                if(result){
                    // valid password
                    var token = jwt.sign({ id: username }, process.env.SECRET, {
                        expiresIn: 86400 // expires in 24 hours
                    })
                    let expireDate = moment()
                    expireDate.add(86400, 's')
                    res.status(200).json({
                        message: "Login successful",
                        username: username,
                        token: token,
                        expiresIn: expireDate.format('LLL')
                    })
                } else {
                    // invalid password
                    res.status(401).json({
                        message: "Wrong password"
                    })
                }
            })
        }
        else {
            // invalid username
            res.json({
                status: "error",
                message: "Username does not exist"
            })
        }
    })
})

// protected route test
router.get('/me', VerifyToken, (req, res) =>
{
    res.send(req.username)
})

// The logout endpoint is not needed. The act of logging out can solely be done 
// through the client side. A token is usually kept in a cookie or the browser’s
// localstorage. Logging out is as simple as destroying the token on the client.

// User account management...
// router.post('/user/:id', db.updatePassword) // missing hashing
// router.delete('/user/:id', db.deleteUser)