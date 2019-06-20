require('dotenv').config();

const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    ttl: +process.env.SESSION_TTL,
    redisTtl: +process.env.REDIS_TTL,
    redisHost: process.env.REDIS_HOST,
    redisPort: +process.env.REDIS_PORT
}

module.exports = sessionOptions;