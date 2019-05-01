// Configuration of express app
const express = require('express')
const cors = require('cors')

// Routes
const app = module.exports = express()
app.use(cors())
app.use('/users', require('../routes/users'))
app.use('/home', require('../routes/home'))
app.use('/bank-account', require('../routes/bank-account'))