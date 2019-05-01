const request = require('supertest')
const app = require('../../app')
const db = require('../../db/db-module')
const utils = require('../../db/utils')

const valid_user_data = {
    username: 'Test',
    password: 'tester',
    ssn: '123-456-789'
}

QUnit.module('/users/ Testing', 
{
    // rebuilding database before starting tests
    before: assert => {
        const done = assert.async()
        utils.rebuildDatabase()
            .then(() => {
                done()
            })
            .catch(error => {
                console.log(error)
                done()
            })
    }
})

QUnit.test("Register user provided valid data", async assert =>
{
    const done = assert.async()
    const valid_response = {
        status: 'ok',
        message: 'Test'
    }
    const query = `INSERT INTO customer (ssn, first_name, last_name, 
        street_address, city, state, zip, phone, email_address) VALUES 
        ('123-456-789', 'first-test', 'last-test', 'addr-test', 'city-test', 
        'TE', '99999', '000-111-2222', 'test@test.com')`

    db.query(query)
        .then()
        .catch(err =>
        {
            console.log(err)
            assert.ok(false, 'Failed creating test customer')
            done()
        })

    try {
        const response = await request(app)
            .post('/users/register')
            .send(valid_user_data)
            .expect('Content-Type', /json/)
        assert.equal(response.body.status, 'ok')
        assert.deepEqual(response.body, valid_response)
        done()
    } catch (err) {
        assert.ok(false, `FAIL /users/register with ${err}`)
        done()
    }
})

QUnit.test("Login user provided verified data", async assert=>
{
    const assertAsync = assert.async()
    try {
        const response = await request(app)
            .post('/users/login')
            .send(valid_user_data)
            .expect('Content-Type', /json/)
        assertAsync()
        assert.equal(response.body.status, 'ok')
    } catch (err) {
        assertAsync()
        assert.ok(false, `FAIL /users/login with ${err}`)
    }
})
