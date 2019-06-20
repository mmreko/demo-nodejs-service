const assert = require('assert');
const httpMocks = require('node-mocks-http');

const handlers = require('../../../../server/routes/handlers/basicHandlers');

describe('basicRouteHandler function', () => {
    it('should print a Hello, Stranger! message if the user is not logged in', () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/',
            session: {
                name: null
            }
        })
        const res = httpMocks.createResponse();

        handlers.basicRouteHandler(req, res);

        assert.equal(res.statusCode, 200);
        assert.equal(res._getData(), 'Hello, Stranger!');
    })

    it('should print a personalized message if the user is logged in', () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/',
            session: {
                name: 'John Smith'
            }
        })
        const res = httpMocks.createResponse();

        handlers.basicRouteHandler(req, res);

        assert.equal(res.statusCode, 200);
        assert.equal(res._getData(), 'Hello, John Smith!');
    })
})

describe('loginRouteHandler function', () => {
    const repo = {
        getUserByEmail: () => {
            return {
                _id: '12345',
                email: 'test@test.com',
                password: '$2b$10$q6iFK0mOwZzG5T.9nM/71.ODJxLSoB8QOP8xXqqaZCxpm5BYxY3s2',
                name: 'Test',
                token: 'some-token'
            }
        }
    }

    it('should update session data, generate a token and print a personalized message if the login is successful', async() => {
        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/login',
            body: {
                email: 'test@test.com',
                password: 'pass123'
            },
            session: {}
        })
        const res = httpMocks.createResponse();

        await handlers.loginRouteHandler(req, res, repo);

        assert.equal(res.statusCode, 200);
        assert.equal(req.session._id, '12345');
        assert.equal(req.session.email, 'test@test.com');
        assert.equal(req.session.name, 'Test');
        assert.notEqual(Object.keys(res.header()._getHeaders()).includes('x-auth-header'), -1);
        assert.equal(res._getData(), 'Welcome Test!');
    })

    it('should print an error message if the login is unsuccessful', async() => {
        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/login',
            body: {
                email: 'test@test.com',
                password: 'wrong-password'
            },
            session: {}
        })
        const res = httpMocks.createResponse();

        await handlers.loginRouteHandler(req, res, repo);

        assert.equal(res.statusCode, 200);
        assert.equal(res._getData(), 'Email or password is incorrect!');
    })
})

describe('logoutRouteHandler function', () => {
    it('should destroy the session data', () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/logout',
            session: {
                _id: '12345',
                name: 'Test',
                email: 'test@test.com'
            }
        })
        req.session.destroy = () => {
            req.session._id = null;
            req.session.name = null;
            req.session.email = null;
        }
        const res = httpMocks.createResponse();

        handlers.logoutRouteHandler(req, res);

        assert.equal(req.session._id, null);
        assert.equal(req.session.name, null);
        assert.equal(req.session.email, null);
    })
})

describe('notFoundRouteHandler function', () => {
    it('should return status 404 Not Found', () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/not-found'
        })
        const res = httpMocks.createResponse();

        handlers.notFoundRouteHandler(req, res);

        assert.equal(res.statusCode, 404);
    })
})