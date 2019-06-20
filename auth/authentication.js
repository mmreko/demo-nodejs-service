const bcrypt = require('bcrypt');

const authOptions = require('../config/authOptions');

const hashPassword = async(plaintextPassword) => {
    const hash = await bcrypt.hash(plaintextPassword, authOptions.saltRounds);
    return hash;
}

const login = async(email, password, dependencies) => {
    const { repo, encodeAuthToken } = dependencies;
    const user = await repo.getUserByEmail(email);
    if (!user) return null;
    const authResult = await bcrypt.compare(password, user.password);
    if (!authResult) return null;
    const authToken = await encodeAuthToken(user._id);
    return {
        _id: user._id,
        email: user.email,
        name: user.name,
        authToken
    };
}

module.exports = { hashPassword, login };