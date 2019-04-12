const createTable = {
    name: 'create-customer-table',
    text: 
    `CREATE TABLE customer (
        ssn VARCHAR(9) PRIMARY KEY,
        account_number VARCHAR(9) REFERENCES bank_account(account_number),
        first_name VARCHAR(20) NOT NULL,
        last_name VARCHAR(20) NOT NULL,
        home_address VARCHAR(355) NOT NULL,
        telephone VARCHAR(10) NOT NULL,
        email_address VARCHAR(355) NOT NULL
    );`
}

module.exports = {
    createTable
}