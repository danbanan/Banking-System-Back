require('dotenv').config()
const express = require('express')
const config = require('./config/express')
const utils = require('./db/utils')
const port = 3000

// Mount express config file to main express app
const app = express()
app.use(config)

if (process.env.REBUILD_DATA && process.env.REBUILD_DATA === "TRUE") {
    utils.rebuildDatabase()
}

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})

module.exports = app