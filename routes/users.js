const express = require('express')
const router = express.Router()
// const User = require('../models/user')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const client = require('../config/database')

// Register route
router.post('/register', (req, res, next) =>
{
    const email = req.body.email
    const pswd = req.body.password

    User.addUser(email, pswd, err => 
    {
        if(err){
            res.json({success: false, msg: 'Failed to register user'})
        } else {
            res.json({success: true, msg: 'User registered'})
        }
    })
})

// Authenticate route
router.post('/athenticate', (req, res, next) =>
{
    const email = req.body.email
    const password = req.body.password

    User.getUserByName(email, (err, user) => 
    {
        if(err) throw err
        if(!user) {
            return res.json({success: false, msg: 'User not found'})
        }

        User.comparePassword(password, user.password, (err, isMatch) =>
        {
            if(err) throw err
            if(isMatch) {
                const token = jwt.sign(user, config.secret, {expiresIn: 604800})
                res.json({
                    success: true,
                    token: 'JWT' + token,
                    user: {
                        user: user._id,
                        email: user.email
                    }
                })
            } else {
                return res.json({success: false, msg: 'Wrong password'})
            }
        })
    })
})

// Profile route
router.get('/profile', passport.authenticate('jwt', {session: false}, 
(req, res, next) => 
{
    res.json({user: req.user})
}))

module.export = router