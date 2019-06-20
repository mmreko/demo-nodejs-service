const jwt = require('jsonwebtoken');

const authOptions = require('../config/authOptions');

const encodeAuthToken = async(id) => {
    const token = await jwt.sign({ _id: id }, authOptions.key, {expiresIn: 3600});
    return token;
}

const decodeAuthToken = async(token) => {
    if (!token) {
        return null;
    }
    try {
        const decoded = await jwt.verify(token, authOptions.key);
        return decoded;
    } catch(error) {
        return null;
    }
}

module.exports = { encodeAuthToken, decodeAuthToken };