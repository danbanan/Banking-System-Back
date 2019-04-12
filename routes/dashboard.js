const express = require('express')
const db = require('../db/db-module')
const VerifyToken = require('../auth/VerifyToken')

const router = module.exports = express.Router()

router.use(express.urlencoded({extended: true}))
router.use(express.json())

router.get('/', VerifyToken, (req, res) =>
{
    res.send('Dashboard')
})