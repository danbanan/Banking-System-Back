const createTable = {
    name: 'create-user-account-table',
    text: 
    `CREATE TABLE user_account (
        username VARCHAR(50) PRIMARY KEY,
        pswd_hash VARCHAR(60) NOT NULL,
        ssn VARCHAR(9) REFERENCES customer(ssn) 
    );`
}

const createUser = (username, hash) => {
    return `INSERT INTO user_account(username, pswd_hash) 
    VALUES ('${username}', '${hash}') RETURNING username;`
}

const getUserByUsername = (username) => {
    return (`SELECT * FROM user_account WHERE username = '${username}'`)
}

const getPswdByUsername = (username) => {
    return `SELECT pswd_hash FROM user_account WHERE username = '${username}'`
}

module.exports = {
    createTable,
    createUser,
    getUserByUsername,
    getPswdByUsername
}