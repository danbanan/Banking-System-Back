// Configuration of express app
const express = require('express')

// Routes
const app = module.exports = express()
app.use('/users', require('../routes/users'))
app.use('/dashboard', require('../routes/dashboard'))