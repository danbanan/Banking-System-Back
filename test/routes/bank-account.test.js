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
    // close account that belongs to user [x]
    // trying to close that does not belong to user []

QUnit.test('Close account belonging to user', async assert =>
{
    const done = assert.async()
    const open_account = { account_type: 'c' }
    const valid_response = {
        status: 'ok',
        message: 'Closing account was successful'
    }

    try {
        let response = await request(app)
            .post('/bank-account/open')
            .send(open_account)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)

        const account_number = response.body.message

        response = await request(app)
            .put('/bank-account/close')
            .send({ account_number: account_number })
            .set('x-access-token', token)
            .expect('Content-Type', /json/)

        done()
        assert.deepEqual(response.body, valid_response)

    } catch (error) {
        done()
        assert.ok(false, `FAIL /bank-account/close with ${error}`)
    }
})

// test open end-point
    // open new account with valid type [x]
    // trying to open new account with invalid type []

QUnit.test('User opens new bank account', async assert =>
{
    const done = assert.async()

    try {
        const response = await request(app)
            .post('/bank-account/open')
            .send({ account_type: 's' })
            .set('x-access-token', token)
            .expect('Content-Type', /json/)

        done()
        assert.equal(response.body.status, 'ok')
    } catch (error) {
        done()
        assert.ok(false, `FAIL /bank-account/open with ${error}`)
    }
})

// test deposit end-point
    // deposit valid amount [x]
    // trying to deposit a negative value []
    // trying to deposit to an account not belonging to the user []
QUnit.test('Deposit a valid amount', async assert =>
{
    const done = assert.async()
    
    try {
        // open account
        let response = await request(app)
            .post('/bank-account/open')
            .send({ account_type: 's' })
            .set('x-access-token', token)
            .expect('Content-Type', /json/)

        // make deposit
        const valid_request = {
            account_number: response.body.message,
            amount: 5000,
            description: 'deposit-test'
        }

        response = await request(app)
            .post('/bank-account/deposit')
            .send(valid_request)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)    

        done()
        assert.equal(response.body.status, 'ok')
    } catch (error) {
        done()
        assert.ok(false, `FAIL /bank-account/deposit with ${error}`)
    }
})

// test withdrawal end-point
    // withdrawal with sufficient funds [x]
    // withdrawal with insufficient funds [x]
    // trying to withdrawal from an account that does not belong to user []

QUnit.test('Withdrawal and there are sufficient funds', async assert =>
{
    const done = assert.async()
    
    try {
        // open account
        let response = await request(app)
            .post('/bank-account/open')
            .send({ account_type: 's' })
            .set('x-access-token', token)
            .expect('Content-Type', /json/)

        account_number = response.body.message

        const deposit_request = {
            account_number: account_number,
            amount: 5000,
            description: 'deposit-test'
        }
        // make deposit
        response = await request(app)
            .post('/bank-account/deposit')
            .send(deposit_request)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
        
        const withdrawal_request = {
            account_number: account_number,
            amount: 2000,
            description: 'withdrawal-test'
        }

        // make withdrawal 
        response = await request(app)       
            .post('/bank-account/withdrawal')
            .send(withdrawal_request)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)

        done()
        assert.equal(response.body.message, 3000)

    } catch (error) {
        done()
        assert.ok(false, `FAIL /bank-account/withdrawal with ${error}`)
    }
})

QUnit.test('Withdrawal and there are insufficient funds', async assert =>
{
    const done = assert.async()
    
    try {
        // open account
        let response = await request(app)
            .post('/bank-account/open')
            .send({ account_type: 's' })
            .set('x-access-token', token)
            .expect('Content-Type', /json/)

        account_number = response.body.message

        const deposit_request = {
            account_number: account_number,
            amount: 5000,
            description: 'deposit-test'
        }
        // make deposit
        response = await request(app)
            .post('/bank-account/deposit')
            .send(deposit_request)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
        
        const withdrawal_request = {
            account_number: account_number,
            amount: 6000,
            description: 'withdrawal-test'
        }

        // make withdrawal 
        response = await request(app)       
            .post('/bank-account/withdrawal')
            .send(withdrawal_request)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)

        if (response.body.status === 'error') {
            done()
            assert.ok(true, 'Insufficient funds resulted in error')
        } else {
            done()
            assert.ok(false, 'Insufficient funds did not result in error')
        }
    } catch (error) {
        done()
        assert.ok(false, `FAIL /bank-account/withdrawal with ${error}`)
    }
})

// test transfer end-point betweeen internal accounts
    // transfer with sufficient funds []
    // transfer with insufficient funds []


// test transfer end-point between external accounts within the bank
    // transfer with sufficient funds []
    // transfer with insufficient funds []

// get bank account transaction history end-point
    // account belonging to user []
    // account not belonging to user []