const express = require('express');

const handlers = require('../handlers/basicHandlers');

const setupBasicRoutes = (app, repo) => {

    const router = express.Router();

    router.get('/', handlers.basicRouteHandler);
    router.post('/login', (req, res) => handlers.loginRouteHandler(req, res, repo));
    router.get('/logout', handlers.logoutRouteHandler);
    router.get('*', handlers.notFoundRouteHandler);

    app.use('/', router);

}

module.exports = setupBasicRoutes;