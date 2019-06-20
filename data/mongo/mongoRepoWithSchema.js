const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;

const mongoOptions = require('../../config/mongoOptions');
const hashPassword = require('../../auth/authentication').hashPassword;
const UserModel = require('./models/User');

const connectionUrl = `${mongoOptions.host}:${mongoOptions.port}/${mongoOptions.db}`;

class MongoRepoWithSchema {

    async connect() {
        await mongoose.connect(connectionUrl, { useNewUrlParser: true });
        console.log(`Database connected!`);
    }

    async getUsers() {
        return await UserModel.find({});
    }

    async getUserById(id) {
        try {
            return await UserModel.findById(id);
        } catch(error) {
            return null;
        }
    }

    async getUserByEmail(email) {
        return await UserModel.findOne({ email: email });
    }

    async insertUser(user) {
        const plaintextPassword = user.password;
        user.password = await hashPassword(plaintextPassword);
        const newUser = new UserModel(user);
        const result = await newUser.save();
        return result._id;
    }

    async updateUser(id, user) {
        await UserModel.updateOne({ _id: ObjectID(id) }, user);
    }

    async deleteUser(id) {
        await UserModel.deleteOne({ _id: ObjectID(id) });
    }

    async disconnect() {
        mongoose.connection.close();
    }

}

const connectToMongoRepoWithSchema = async() => {
    const mongoRepo = new MongoRepoWithSchema();
    await mongoRepo.connect();
    return mongoRepo;
}

module.exports = connectToMongoRepoWithSchema;