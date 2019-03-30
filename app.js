const client = require('./config/database') // Active connection
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')

const app = express()
// Importing express router from users.js
const users = require('./routes/users')

// port number
const port = 3000

// CORS middelware
app.use(cors())

// Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Body parser middelware
app.use(bodyParser.json())
// requires middelware function but rn users has a reference to an object
app.use('/users', users) 

// // Passport middelware
// app.use(passport.initialize())
// app.use(passport.session())
// require('./config/passport')(passport)

// Index route
app.get('/', (res, req) =>
{
    res.send('Invalid endpoint')
})

// Start server
app.listen(port, () =>
{
    console.log('Server started at port' + port)
})
    

// running getUser function from the database file
// client.getUsers()
//     .then(res => console.log(res.rows))
//     .catch(e => console.error(e.stack))

// client.getEmail('dan.rachou@sjsu.edu')
//     .then(res => {
//         if(res.rows)
//         {
//             console.log('User already exists!')
//         }
//         else
//         {
//             console.log('Not exists')
//         }
//     })
//     .catch(e => console.error(e.stack))

