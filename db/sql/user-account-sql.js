const createTable = {
    name: 'create-user-account-table',
    text: 
    `CREATE TABLE user_account (
        username VARCHAR(50) PRIMARY KEY,
        pswd_hash VARCHAR(60) NOT NULL,
        ssn VARCHAR(11) REFERENCES customer(ssn) 
    );`
}

const createUser = `INSERT INTO user_account(username, pswd_hash, ssn) 
    VALUES ($1, $2, $3) RETURNING username;`

const getUserByUsername = 'SELECT * FROM user_account WHERE username = $1'

const getPswdByUsername = `SELECT pswd_hash FROM user_account 
WHERE username = $1`

const getSsnByUsername = `SELECT ssn FROM user_account WHERE username = $1`

const changePassword = `UPDATE user_account SET pswd_hash = $1 
WHERE user_name = $2`

const deleteUser = 'DELETE FROM user_account WHERE user_name = $1'

module.exports = {
    createTable,
    createUser,
    getUserByUsername,
    getPswdByUsername,
    changePassword,
    deleteUser,
    getSsnByUsername
}