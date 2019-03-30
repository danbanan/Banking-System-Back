require('dotenv').config()
const {Client} = require('pg');
const bcrypt = require('bcryptjs')

const client = new Client()
client.connect()

client.query('SELECT NOW()', (err, res) =>
{
    // On error
    if(err) {
        console.log('Database error: ')
        console.log(err)
    } 
    // On connection
    else {
        console.log('Connected to database:')
        console.log(res)
    }
})

// client.query('SELECT * FROM users')
//     .then(res => console.log(res.rows))
//     .catch(e => console.error(e.stack))

// Example queries
const getUsers = () => {
    return client.query('SELECT * FROM users')
}

const getUserByEmail = (email) => {
    return client.query('SELECT email, hashpswd FROM users WHERE email = $1', 
    [email])
}

const addUser = (email, pswd, callback) =>
{
    bcrypt.genSalt(10, (err, salt) => 
    {
        bcrypt.hash(pswd, salt, (err, hash) =>
        {
            if(err) throw err
            return client.query('INSERT INTO users(email, hashpswd) VALUES ($1, $2)',
            email, hash)
        })
    })
}

const comparePassword = (candidatePswd, hash) =>
{
    bcrypt.compare(candidatePswd, hash, (err, isMatch) =>
    {
        if(err) throw err
        return isMatch
    })
}

// export connection and queries
module.exports = {
    client,
    getUsers,
    getUserByEmail,
    addUser,
    comparePassword,
}