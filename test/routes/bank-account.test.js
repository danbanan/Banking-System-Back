const request = require('supertest')
const app = require('../../app')
const db = require('../../db/db-module')
const utils = require('../../db/utils')

let token;

QUnit.module('/bank-account/ Testing', 
{
    // rebuilding database -> register test user -> 
    // log in test user -> store token
    before: assert => {
        const done = assert.async()
        utils.rebuildDatabase()
            .then(() => {
                const query = `INSERT INTO customer (ssn, first_name, last_name, 
                    street_address, city, state, zip, phone, email_address) 
                    VALUES ('123-456-789', 'first-test', 'last-test', 
                    'addr-test', 'city-test', 'TE', '99999', '000-111-2222', 
                    'test@test.com')`

                const valid_user_data = {
                    username: 'Test',
                    password: 'tester',
                    ssn: '123-456-789'
                }
                
                db.query(query)
                    .then(async () =>
                    { 
                        try {
                            // register user
                            await request(app)
                                .post('/users/register')
                                .send(valid_user_data)
                            
                            // log in user -> store token globally for testing
                            const response = await request(app)
                                .post('/users/login')
                                .send(valid_user_data)
                                .expect('Content-Type', /json/)
                            done()
                            token = response.body.token
                        } 
                        catch (err) {
                            done()
                        }
                    })
            })
            .catch(error => {
                console.log(error)
                done()
            })
    }
})

// test close end-point
    // invalid token []
    // close account that belongs to user []
    // trying to close that does not belong to user []

// test open end-point
    // invalid token []
    // open new account with valid type []
    // trying to open new account with invalid type []

// test deposit end-point
    // invalid token []
    // deposit valid amount []
    // trying to deposit a negative value []
    // trying to deposit to an account not belonging to the user []

// test withdrawal end-point
    // invalid token []
    // withdrawal with sufficient funds []
    // withdrawal with insufficient funds []
    // trying to withdrawal from an account that does not belong to user []

// test transfer end-point betweeen internal accounts
    // invalid token []
    // transfer with sufficient funds []
    // transfer with insufficient funds []

// test transfer end-point between external accounts within the bank
    // invalid token []
    // transfer with sufficient funds []
    // transfer with insufficient funds []

// get bank account transaction history end-point
    // invalid token []
    // account belongi ng to user []
    // account not belonging to user []
    // 