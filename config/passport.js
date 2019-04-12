const bcrypt = require('bcrypt')
const db = require('../db/db-module')
const LocalStrategy = require('passport-local').Strategy

module.exports = function(passport) {
    passport.use(new LocalStrategy((username, password, done) => 
    {
        // Match user
        db.query(`SELECT * FROM user_account WHERE username = '${username}'`, 
        (err, result) => 
        {
            if(err) {
                console.error('Error when selecting user on login', err)
                return done(err)
            }
    
            if(result.rows.length > 0) {
                const first = result.rows[0]
                // Match password
                bcrypt.compare(password, first.pswd_hash, function(err, res) 
                {   
                    if(res) {
                        done(null, { username: first.username })
                    } 
                    // wrong password
                    else {
                        done(null, false, { message: 'Incorrect password' })
                    }
                })
            } 
            // user not found
            else {
                done(null, false)
           }
        })
    }))
}
