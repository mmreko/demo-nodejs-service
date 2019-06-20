const mysql = require('mysql');
const util = require('util');
const uuid = require('uuid/v4');

const mysqlOptions = require('../../config/mysqlOptions');
const hashPassword = require('../../auth/authentication').hashPassword;

class MySqlRepo {

    constructor() {
        this.pool = null;
    }

    async connect() {
        this.pool = mysql.createPool(mysqlOptions);
        this.pool.query = util.promisify(this.pool.query);
        console.log(`Database connected!`);
    }

    async getUsers() {
        return await this.pool.query('SELECT * FROM users');
    }

    async getUserById(id) {
        const query = 'SELECT * FROM users WHERE _id=?';
        const args = [id];
        const preparedQuery = mysql.format(query, args);
        const queryResult = await this.pool.query(preparedQuery);
        if (queryResult.length === 0) return null;
        else return queryResult[0];
    }

    async getUserByEmail(email) {
        const query = 'SELECT * FROM users WHERE email=?';
        const args = [email];
        const preparedQuery = mysql.format(query, args);
        const queryResult = await this.pool.query(preparedQuery);
        if (queryResult.length === 0) return null;
        return queryResult[0];
    }

    async insertUser(user) {
        const hashedPassword = await hashPassword(user.password);
        const id = uuid();
        const query = 'INSERT INTO users (_id, email, password, name) VALUES (?, ?, ?, ?)';
        const args = [id, user.email, hashedPassword, user.name];
        const preparedQuery = mysql.format(query, args);
        await this.pool.query(preparedQuery);
        return id;
    }

    async updateUser(id, user) {
        const query = 'UPDATE users SET email=?, name=? WHERE _id=?';
        const args = [user.email, user.name, id];
        const preparedQuery = mysql.format(query, args);
        await this.pool.query(preparedQuery);
    }

    async deleteUser(id) {
        const query = 'DELETE FROM users WHERE _id=?';
        const args = [id];
        const preparedQuery = mysql.format(query, args);
        await this.pool.query(preparedQuery);
    }

    async disconnect() {
        await this.pool.end();
    }

}

const connectToMySqlRepo = async() => {
    const mysqlRepo = new MySqlRepo();
    await mysqlRepo.connect();
    return mysqlRepo;
}

module.exports = connectToMySqlRepo;