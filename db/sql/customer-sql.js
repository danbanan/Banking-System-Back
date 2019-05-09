const createTable = {
    name: 'create-customer-table',
    text: 
    `CREATE TABLE customer (
        ssn VARCHAR(11) PRIMARY KEY,
        first_name VARCHAR(20) NOT NULL,
        last_name VARCHAR(20) NOT NULL,
        street_address VARCHAR(50) NOT NULL,
        city VARCHAR(50) NOT NULL,
        state CHAR(2) NOT NULL,
        zip VARCHAR(10) NOT NULL,
        phone VARCHAR(12) NOT NULL,
        email_address VARCHAR(355) NOT NULL
    );`
}

const populate = {
    name: 'populate-customer-table',
    text:
    `INSERT INTO customer (ssn, first_name, last_name, street_address, city, 
        state, zip, phone, email_address)
    VALUES
    ('317-14-4057', 'Jordan', 'Bell', '9188 Young St.', 'Panorama City', 'CA',
    '91402', '202-555-0163', 'jordan.bell@warriors.com'),
    ('249-89-9093', 'Andrew', 'Bogut', '819 North Pheasant Ave.', 
    'Rancho Cucamonga', 'CA', '91730', '202-555-0153', 'andrew.bogut@warriors.com'),
    ('192-40-8735', 'Quinn', 'Cook', '9004 Clinton Street', 'Vallejo', 'CA', 
    '94591', '202-555-0160', 'quinn.cook@warriors.com'),
    ('627-10-7680', 'DeMarcus', 'Cousins', '556 Grandrose St.', 'El Cajon', 'CA',
    '92020', '202-555-0128', 'demarcus.cousins@warriors.com'),
    ('388-19-3667', 'Stephen', 'Curry', '46 Wakehurst Dr.', 'Lompoc', 'CA', 
    '93436', '202-555-0199', 'stephen.curry@warriors.com'),
    ('608-82-2944', 'Marcus', 'Derrickson', '39 High Ridge Rd.', 'Carmichael',
    'CA', '95608', '202-555-0133', 'marcus.derrickson@warriors.com'),
    ('987-65-4321', 'Dan', 'Rachou', '375 South 9th Street', 'San Jose', 'CA',
    '95112', '012-345-6789', 'dan.rachou@sjsu.edu');
    `
}

const getCustomerBySsn = 'SELECT * FROM customer WHERE ssn = $1'

module.exports = {
    createTable,
    populate,
    getCustomerBySsn
}