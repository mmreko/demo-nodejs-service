require('dotenv').config();

const mongoOptions = {
    host: process.env.MONGO_DB_HOST,
    port: process.env.MONGO_DB_PORT,
    db: process.env.MONGO_DB_NAME
}

module.exports = mongoOptions;