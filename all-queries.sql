-- [] means not implemented to back-end application
-- [x] means implemented to back-end application

-- [] customer table
CREATE TABLE customer (
  ssn INT PRIMARY KEY,
  usr_name VARCHAR(50) REFERENCES user_account(usr_name),
  account_number VARCHAR(9) REFERENCES bank_account(account_number),
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL,
  home_address VARCHAR(355) NOT NULL,
  telephone VARCHAR(10) NOT NULL,
  email_address VARCHAR(355) NOT NULL,
);

-- [] user account table
CREATE TABLE user_account (
  usr_name VARCHAR(50) PRIMARY KEY,
  pswd_hash VARCHAR(60) NOT NULL,
);

-- [] bank acount table
CREATE TABLE bank_account (
  account_number VARCHAR(9) PRIMARY KEY,
  balance float(2) NOT NULL,
  check_account BOOL DEFAULT 't',
  saving_account BOOL DEFAULT 'f',
  open_account BOOL DEFAULT 't',
);

-- [] insert new customer

-- [] create user account

-- [] find user by user_name and password

-- [] delete user account

-- [] change user_name on user account

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
