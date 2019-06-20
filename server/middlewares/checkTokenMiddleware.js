const decodeAuthToken = require('../../auth/authTokens').decodeAuthToken;

const checkTokenMiddleware = async(req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    const result = await decodeAuthToken(token);
    if (result) {
        req.user = result._id;
        next();
    }
    else {
        res.sendStatus(401);
    }
}

module.exports = checkTokenMiddleware;