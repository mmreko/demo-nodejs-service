const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: String,
    password: String,
    name: String,
    type: { type: String, default: 'mongo' }
});

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;