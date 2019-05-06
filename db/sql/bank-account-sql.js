const createTable = {
    name: 'create-bank-account-table',
    text: 
    `CREATE TABLE bank_account (
        account_number SERIAL PRIMARY KEY,
        ssn VARCHAR(11) REFERENCES customer(ssn),
        balance float(2) NOT NULL DEFAULT 0,
        name VARCHAR(50) NOT NULL,
        account_type CHAR(1) DEFAULT 'c',
        isOpen BOOL DEFAULT 't');`
}

const populate = {
    name: 'populate-bank-account-table',
    text: 
    `INSERT INTO bank_account (balance, ssn, name, account_type, isopen)
    VALUES 
    (70400, '317-14-4057', 'Checking', DEFAULT, DEFAULT),
    (50080, '317-14-4057', 'Savings','s', DEFAULT),
    (1020000, '249-89-9093', 'Checking',DEFAULT, DEFAULT),
    (1004000, '249-89-9093', 'Savings','s', DEFAULT),
    (5000, '192-40-8735', 'Checking', DEFAULT, DEFAULT);`
}

const closeAccount = `UPDATE bank_account SET isOpen = FALSE 
    WHERE account_number = $1`

const createAccount = `INSERT INTO bank_account (ssn, name, account_type) 
    VALUES ($1, $2, $3) RETURNING account_number`

const makeDeposit = `UPDATE bank_account SET balance = balance + $1 
    WHERE account_number = $2 RETURNING balance`

const makeWithdrawal = `UPDATE bank_account SET balance = balance - $1 
    WHERE account_number = $2 RETURNING balance`

const getBalance = `SELECT balance FROM bank_account WHERE account_number = $1`

const getTransactions = `SELECT amount, t.balance, date, description 
    FROM bank_account b JOIN transaction t ON 
    b.account_number = t.account_number WHERE b.account_number = $1;`

const getOpenAccounts = `SELECT account_number, balance, name, account_type 
    FROM bank_account WHERE ssn = $1 AND isOpen = true`

const getBankAccount = `SELECT * FROM bank_account WHERE account_number = $1
    AND ssn = $2 AND isOpen = true`

module.exports = {
    createTable,
    populate,
    closeAccount,
    createAccount,
    makeDeposit,
    makeWithdrawal,
    getBalance,
    getTransactions,
    getOpenAccounts,
    getBankAccount
}