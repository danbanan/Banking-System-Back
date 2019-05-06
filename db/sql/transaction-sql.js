const createTable = {
    name: 'create-transaction-table',
    text:
    `CREATE TABLE transaction (
        id SERIAL PRIMARY KEY,
        account_number INTEGER REFERENCES bank_account(account_number),
        amount float(2) NOT NULL,
        date DATE NOT NULL,
        balance float(2) NOT NULL,
        description VARCHAR(355) NOT NULL
    )`
}

const populate = {
    name: 'populate-transaction-table',
    text: ``
}

const updateHistory = `INSERT INTO transaction (account_number, amount, date,
    balance, description) VALUES ($1, $2, CURRENT_DATE, $3, $4)`

module.exports = {
    createTable,
    populate,
    updateHistory
}