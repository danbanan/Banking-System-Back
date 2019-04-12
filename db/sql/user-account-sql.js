const createTable = {
    name: 'create-user-account-table',
    text: 
    `CREATE TABLE user_account (
        username VARCHAR(50) PRIMARY KEY,
        pswd_hash VARCHAR(60) NOT NULL,
        ssn VARCHAR(9) REFERENCES customer(ssn) 
    );`
}

const createUser = {
    name: 'insert-new-user',
    text:
    `INSERT INTO user_account(username, pswd_hash) 
    VALUES ('$1', '$2') RETURNING username;`
}

const getUserByUsername = (username) => {
    return (`SELECT * FROM user_account WHERE username = '${username}'`)
}


// const getUserByUsername = {
//     name: 'get-user-by-username',
//     text: 'SELECT * FROM user_account WHERE username = $1'
// }

const getPswdByUsername = {

}

module.exports = {
    createTable,
    createUser,
    getUserByUsername
}