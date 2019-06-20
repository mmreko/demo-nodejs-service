require('dotenv').config();

const authOptions = {
    key: process.env.KEY,
    saltRounds: +process.env.SALT_ROUNDS
}

module.exports = authOptions;