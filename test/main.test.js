const utils = require('../db/utils')
const db = require('../db/db-module')

QUnit.done(() => {
    // reset everything back and close database connection
    utils.rebuildDatabase()
        .then(() => db.closeDBConnections())
})
