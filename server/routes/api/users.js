const express = require('express');

const handlers = require('../handlers/usersHandlers');
const checkAuthToken = require('../../middlewares/checkTokenMiddleware');

const setupUserRoutes = (app, repo) => {

    const router = express.Router();

    router.get('/', (req, res) => handlers.getUsersRouteHandler(req, res, repo));
    router.get('/current', checkAuthToken, (req, res) => handlers.getCurrentUserRouteHandler(req, res, repo));
    router.get('/:id', (req, res) => handlers.getUserRouteHandler(req, res, repo));
    router.post('/insert', (req, res) => handlers.insertUserRouteHandler(req, res, repo));
    router.put('/update/:id', (req, res) => handlers.updateUserRouteHandler(req, res, repo));
    router.delete('/delete/:id', (req, res) => handlers.deleteUserRouteHandler(req, res, repo));

    app.use('/users', router);

}

module.exports = setupUserRoutes;