const uuid = require('uuid/v4');

const hashPassword = require('../../auth/authentication').hashPassword;

class StaticRepo {

    constructor() {
        this.users = [];
    }

    async connect() {
        this.users = require('./staticData');
        console.log('Database connected!');
    }

    async getUsers() {
        return this.users;
    }

    async getUserById(id) {
        const user = this.users.find(user => user._id === id);
        if (user === undefined) return null;
        else return user;
    }

    async getUserByEmail(email) {
        const user = this.users.find(user => user.email === email);
        if (user === undefined) return null;
        return user;
    }

    async insertUser(user) {
        user._id = uuid();
        const plaintextPassword = user.password;
        user.password = await hashPassword(plaintextPassword);
        user.type = 'static';
        this.users.push(user);
    }

    async updateUser(id, user) {
        const index = this.users.findIndex(user => user._id === id);
        if (index === -1) return;
        this.users[index].email = user.email;
        this.users[index].name = user.name;
    }

    async deleteUser(id) {
        this.users = this.users.filter(user => user._id !== id);
    }

    async disconnect() {
        this.users = [];
    }

};

const connectToStaticRepo = () => {
    const staticRepo = new StaticRepo();
    staticRepo.connect();
    return staticRepo;
}

module.exports = connectToStaticRepo;