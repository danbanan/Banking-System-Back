const createTable = {
    name: 'create-transaction-table',
    text:
    `CREATE TABLE transaction (
        id SERIAL PRIMARY KEY,
        account_number INTEGER REFERENCES bank_account(account_number),
        amount INTEGER NOT NULL,
        description VARCHAR(355) NOT NULL
    )`
}

const populate = {
    name: 'populate-transaction-table',
    text: ``
}

const updateHistory = `INSERT INTO transaction (account_number, amount, 
    description) VALUES ($1, $2, $3)`

module.exports = {
    createTable,
    populate,
    updateHistory
}