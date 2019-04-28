const createTable = {
    name: 'create-bank-account-table',
    text: 
    `CREATE TABLE bank_account (
        account_number SERIAL PRIMARY KEY,
        ssn VARCHAR(11) REFERENCES customer(ssn),
        balance float(2) NOT NULL DEFAULT 0,
        account_type CHAR(1) DEFAULT 'c',
        isOpen BOOL DEFAULT 't');`
}

const populate = {
    name: 'populate-bank-account-table',
    text: 
    `INSERT INTO bank_account (balance, ssn, account_type, isopen)
    VALUES 
    (70400, '317-14-4057', DEFAULT, DEFAULT),
    (50080, '317-14-4057','s', DEFAULT),
    (1020000, '249-89-9093',DEFAULT, DEFAULT),
    (1004000, '249-89-9093','s', DEFAULT),
    (5000, '192-40-8735', DEFAULT, DEFAULT);`
}

const closeAccount = `UPDATE bank_account SET isOpen = FALSE 
    WHERE account_number = $1`

const createAccount = `INSERT INTO bank_account (ssn, account_type) 
    VALUES ($1, $2) RETURNING account_number`

const makeDeposit = `UPDATE bank_account SET balance = balance + $1 
    WHERE account_number = $2`

const makeWithdrawal = `UPDATE bank_account SET balance = balance - $1 
    WHERE account_number = $2`

const getBalance = `SELECT balance FROM bank_account WHERE account_number = $1`

module.exports = {
    createTable,
    populate,
    closeAccount,
    createAccount,
    makeDeposit,
    makeWithdrawal,
    getBalance
}