-- [] means not implemented to back-end application
-- [x] means implemented to back-end application

-- [] customer table
CREATE TABLE customer (
  ssn VARCHAR(9) PRIMARY KEY,
  account_number VARCHAR(9) REFERENCES bank_account(account_number),
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL,
  home_address VARCHAR(355) NOT NULL,
  telephone VARCHAR(10) NOT NULL,
  email_address VARCHAR(355) NOT NULL
);

-- [] user account table
CREATE TABLE user_account (
  username VARCHAR(50) PRIMARY KEY,
  pswd_hash VARCHAR(60) NOT NULL,
  ssn VARCHAR(9) REFERENCES customer(ssn) 
);

-- [] bank acount table
CREATE TABLE bank_account (
  account_number VARCHAR(9) PRIMARY KEY,
  balance float(2) NOT NULL,
  account_type CHAR(1) DEFAULT 'c',
  isOpen BOOL DEFAULT 't'
);

-- [] clear customer table

-- [] clear user account table

-- [] clear bank account table

-- [x] create user account
INSERT INTO user_account(username, pswd_hash)
VALUES (${usr}, ${pswd});

-- [] get all users
SELECT *
FROM user_account;

-- [x] find user by username
SELECT *
FROM user_account
WHERE username = '${username}';

-- [x] verify user, return password
SELECT pswd_hash 
FROM user_account 
WHERE username = '${username}';

-- [] delete user account
DELETE FROM user_account
WHERE username = ${username};

-- [] change change password on user account
UPDATE user_account
SET pswd_hash = ${new_pswd}
WHERE username = ${username};

-- [] get user customer information

-- [] get bank account information

-- [] deposit to checkings account

-- [] withdrawal from checkings account

-- [] transfer from checkings account to savings account

-- [] transfer from savings account to checkings account

-- [] open checkings account

-- [] open savings account

-- [] close checkings account

-- [] close savings account
