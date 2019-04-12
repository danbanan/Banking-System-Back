const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) 
{
    var token = req.headers['x-access-token']
    if(!token){
        res.status(401).json({
            auth: false,
            message: 'No token provided'
        })
    } else {
        jwt.verify(token, process.env.SECRET, (err, decoded) =>
        {
            if(err){
                res.status(500).json({
                    auth: false,
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