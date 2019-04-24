const request = require('supertest')
const app = require('../../app')
const db = require('../../db/db-module')
const utils = require('../../db/utils')

const valid_user_data = {
    username: 'Test',
    password: 'tester',
    ssn: '123456789'
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
    const assertAsync = assert.async()
    const valid_response = {
        status: 'ok',
        message: 'Created user with username: Test'
    }
    try {
        const response = await request(app)
            .post('/users/register')
            .send(valid_user_data)
            .expect('Content-Type', /json/)
        assertAsync()
        assert.equal(response.body.status, 'ok')
        assert.deepEqual(response.body, valid_response)
    } catch (err) {
        assertAsync()
        assert.ok(false, `FAIL /users/register with ${err}`)
    }
})

QUnit.test("Login user provided verified data", async assert=>
{
    const assertAsync = assert.async()
    const valid_response = {
        status: 'ok',
        username: 'Test'
    }
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
