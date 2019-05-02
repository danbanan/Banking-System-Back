const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) 
{
    var token = req.headers['x-access-token']
    if(!token){
        res.json({
            status: 'error',
            message: 'No token provided'
        })
    } else {
        jwt.verify(token, process.env.SECRET, (err, decoded) =>
        {
            if(err){
                res.json({
                    status: 'error',
                    message: 'Failed to authenticate token'
                })
            } else {
                req.username = decoded.id
                next()
            }
        })
    }
}

module.exports = verifyToken