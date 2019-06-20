const connectToStaticRepo = require('../data/static/staticRepo');
const connectToMongoRepo = require('../data/mongo/mongoRepo');
const connectToMongoRepoWithSchema = require('../data/mongo/mongoRepoWithSchema');
const connectToMySqlRepo = require('../data/mysql/mysqlRepo');

require('dotenv').config();

const repoMap = {
    'static': connectToStaticRepo,
    'mongo': connectToMongoRepo,
    'mongo-schema': connectToMongoRepoWithSchema,
    'mysql': connectToMySqlRepo
}

const serverOptions = {
    host: process.env.HOST,
    port: process.env.PORT,
    env: process.env.ENV,
    connectToRepo: repoMap[process.env.DATA]
}

module.exports = serverOptions;