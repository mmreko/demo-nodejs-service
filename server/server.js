const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);

const sessionOptions = require('../config/sessionOptions');
const setupBasicRoutes = require('./routes/api/basic');
const setupUserRoutes = require('./routes/api/users');

const startServer = async(options) => {

    const app = express();
    const redisClient = redis.createClient();

    app.use(morgan(options.env));
    app.use(helmet());

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(session({
        secret: sessionOptions.secret,
        store: new RedisStore({
            host: sessionOptions.redisHost,
            port: sessionOptions.redisPort,
            client: redisClient,
            ttl : sessionOptions.redisTtl
        }),
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: sessionOptions.ttl }
    }))

    const repo = await options.connectToRepo();
    setupUserRoutes(app, repo);
    setupBasicRoutes(app, repo);

    app.listen(options.port, () => console.log(`Server running on http://${options.host}:${options.port}`));

    return app;
}

module.exports = startServer;