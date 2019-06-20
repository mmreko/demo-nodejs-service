const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const mongoOptions = require('../../config/mongoOptions');
const hashPassword = require('../../auth/authentication').hashPassword;

const connectionUrl = `${mongoOptions.host}:${mongoOptions.port}/`;

class MongoRepo {

    constructor() {
        this.db = null;
        this.connection = null;
    }

    async connect() {
        this.connection = await MongoClient.connect(connectionUrl, {useNewUrlParser: true});
        this.db = this.connection.db(mongoOptions.db);
        console.log(`Database connected!`);
    }

    async getUsers() {
        return await this.db.collection('users').find().toArray();
    }

    async getUserById(id) {
        try {
            return await this.db.collection('users').findOne({ _id: ObjectID(id)});
        } catch(error) {
            return null;
        }
    }

    async getUserByEmail(email) {
        try {
            return await this.db.collection('users').findOne({ email: email });
        } catch(error) {
            return null;
        }
    }

    async insertUser(user) {
        const plaintextPassword = user.password;
        user.password = await hashPassword(plaintextPassword);
        user.type = 'mongo';
        const result = await this.db.collection('users').insertOne(user);
        return result.insertedId;
    }

    async updateUser(id, user) {
        await this.db.collection('users').updateOne({ _id: ObjectID(id) }, { $set: user });
    }

    async deleteUser(id) {
        await this.db.collection('users').deleteOne({ _id: ObjectID(id) });
    }

    async disconnect() {
        this.connection.close();
    }

}

const connectToMongoRepo = async() => {
    const mongoRepo = new MongoRepo();
    await mongoRepo.connect();
    return mongoRepo;
}

module.exports = connectToMongoRepo;