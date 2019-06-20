require('dotenv').config();

const mysqlOptions = {
    connectionLimit: process.env.MYSQL_DB_LIMIT,
    user: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_NAME
}

module.exports = mysqlOptions;