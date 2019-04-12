const express = require('express')
const config = require('./config/express')
const port = 3000

// Mount express config file to main express app
const app = express()
app.use(config)

// Load HTML page
app.get('/', (req, res) => { 
    res.sendfile(__dirname + '/views/')
})

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})