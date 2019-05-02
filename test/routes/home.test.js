const request = require('supertest')
const app = require('../../app')
const db = require('../../db/db-module')
const utils = require('../../db/utils')

let token;

QUnit.module('/home/ Testing', 
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
                        // register user
                        try {
                            await request(app)
                                .post('/users/register')
                                .send(valid_user_data)
                            
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

QUnit.test("The user does not have a bank account", async assert =>
{
    const done = assert.async()

    try {
        const response = await request(app)
            .get('/home')
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
        
        done()
        // expecting an empty list
        assert.equal(response.body.message.length, 0)
        
    } catch (error) {
        assert.ok(false, 'Unable to create account')
        done()
    }
})

QUnit.test("The user has one bank account", async assert =>
{
    const done = assert.async()
    const request_data = {
        account_type: 'c'
    }

    // open bank account
    try {
        await request(app)
            .post('/bank-account/open')
            .send(request_data)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)

        response = await request(app)
            .get('/home')
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
        
        done()
        // expecting one account to return
        assert.equal(response.body.message.length, 1)
        
    } catch (error) {
        assert.ok(false, 'Unable to create account')
        done()
    }   
})

// user have more than one account
QUnit.test("The user has more than one bank account", async assert =>
{
    const done = assert.async()
    const request_data1 = {
        account_type: 'c'
    }
    const request_data2 = {
        account_type: 's'
    }

    // open bank account
    try {
        // open one account
        await request(app)
            .post('/bank-account/open')
            .send(request_data1)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)

        // open second account
        await request(app)
            .post('/bank-account/open')
            .send(request_data2)
            .set('x-access-token', token)
            .expect('Content-Type', /json/)

        response = await request(app)
            .get('/home')
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
        
            
        done()
        assert.ok(response.body.message.length > 1, "more than one account returned")
        
    } catch (error) {
        assert.ok(false, 'Unable to create account')
        done()
    }   
})