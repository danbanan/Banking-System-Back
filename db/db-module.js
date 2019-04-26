require('dotenv').config()
const { Pool } = require('pg')
let pool;

if(process.env.LOCAL && process.env.LOCAL === 'TRUE'){
    // Pool of connections so that we don't have to open a client and close it 
    // every time we make a query
    pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    })
    console.log('Starting local database')
    pool.on('error', function (err) {
        console.log(err)
    })
} else {
    console.log('Connecting to remote database')
    // in progress...
}
  
// Close database connections on exit
const closeDBConnections = () => {
    return new Promise((resolve, reject) => {
        console.log('\nCalling end...')
        pool.end()
        process.exit(1);
    })
};

process.on('SIGINT', closeDBConnections);
process.on('SIGTERM', closeDBConnections);

module.exports = {
    // query promise
    query: (text, callback) => { return pool.query(text, callback) },
    closeDBConnections,
    queryPromise: (text) => { return pool.query(text) },
    paramQuery: (text, values) => { return pool.query(text, values) }
}