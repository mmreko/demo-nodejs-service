const encodeAuthToken = require('../../../auth/authTokens').encodeAuthToken;
const login = require('../../../auth/authentication').login;

const basicRouteHandler = (req, res) => {
    try {
        if (req.session && req.session.name) {
            res.send(`Hello, ${req.session.name}!`);
        }
        else {
            res.send('Hello, Stranger!');
        }
    } catch(error) {
        console.error(error);
        res.sendStatus(500);
    }
}

const loginRouteHandler = async(req, res, repo) => {
    try {
        const dependencies = { repo, encodeAuthToken };
        const result = await login(req.body.email, req.body.password, dependencies);
        if (result) {
            req.session._id = result._id;
            req.session.email = result.email;
            req.session.name = result.name;
            res.header('x-auth-token', result.authToken).send(`Welcome ${req.session.name}!`);
        }
        else res.send('Email or password is incorrect!');
    } catch(error) {
        console.error(error);
        res.sendStatus(500);
    }
}

const logoutRouteHandler = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error(err);
            res.sendStatus(500);
        }
        res.redirect('/');
    });
}

const notFoundRouteHandler = (req, res) => {
    try {
        res.sendStatus(404);
    } catch(error) {
        console.error(error);
        res.sendStatus(500);
    }
}

module.exports = { basicRouteHandler, loginRouteHandler, logoutRouteHandler, notFoundRouteHandler };