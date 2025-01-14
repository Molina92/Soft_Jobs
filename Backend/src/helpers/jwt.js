const jwt = require("jsonwebtoken");
require('dotenv').config();

const { JWT_SECRET } = process.env
const signToken = (data) => {
    return jwt.sign(
        data,
        String(JWT_SECRET),
        {
            algorithm: 'HS384',
            expiresIn: '12h'
        })
};

const verifyToken = (token) => {
    return jwt.verify(token, String(JWT_SECRET));
};

module.exports = { 
    signToken,
    verifyToken 
} 