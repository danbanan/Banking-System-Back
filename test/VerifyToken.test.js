const request = require('supertest')
const app = require('../app')
const db = require('../db/db-module')
const utils = require('../db/utils')

let token;

QUnit.module('/VerifyToken/ Testing', 
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

QUnit.test("Valid token provided", async assert => 
{
    const done = assert.async()

    try {
        const response = await request(app)
            .get('/users/me')
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
        
        if (response.body.status === 'ok') {
            assert.equal(response.body.message, 'Test')
            done()
        }

    } catch (error) {
        assert.ok(false, 'VerifyToken function resulted in error')
        done()
    }
})

QUnit.test("Invalid token provided", async assert => 
{
    const done = assert.async()

    try {
        const response = await request(app)
            .get('/users/me')
            .set('x-access-token', 'some-bad-token')
            .expect('Content-Type', /json/)
        
        if (response.body.status === 'error') {
            assert.ok(true, request.body.message)
            done()
        }
        else {
            assert.ok(false, 'Bad token accepted')
            done()
        }
    } catch (error) {
        assert.ok(true, 'VerifyToken function resulted in error')
        done()
    }
})