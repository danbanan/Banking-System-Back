const bank_account = {
    name: 'bank-account-data',
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

const customer = {
    name: 'customer-data',
    text: ``
}

module.exports = {
    bank_account,
    customer
}