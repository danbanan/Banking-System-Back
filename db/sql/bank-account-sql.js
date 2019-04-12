const createTable = {
    name: 'create-bank-account-table',
    text: 
    `CREATE TABLE bank_account (
        account_number VARCHAR(9) PRIMARY KEY,
        balance float(2) NOT NULL DEFAULT 0,
        account_type CHAR(1) DEFAULT 'c',
        isOpen BOOL DEFAULT 't'
    );`
}

const insertPreData = {
    name: 'insert-pre-data',
    text: `
    INSERT INTO bank_account (account_number, balance, account_type, isopen)
    VALUES 
    ('000000001', 70400, DEFAULT, DEFAULT),
    ('000000002', 50080, 's', DEFAULT),
    ('000000003', 1004000, 's', DEFAULT),
    ('000000004', 1020000, DEFAULT, DEFAULT),
    ('000000005', 5000, DEFAULT, DEFAULT);
    `
}

module.exports = {
    createTable,
    insertPreData
}