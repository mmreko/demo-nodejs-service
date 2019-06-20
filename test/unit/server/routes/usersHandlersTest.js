const assert = require('assert');
const httpMocks = require('node-mocks-http');

const handlers = require('../../../../server/routes/handlers/usersHandlers');

describe('getUsersRouteHandler function', () => {
    it('should return an array of users', async() => {
        const repo = {
            getUsers: () => {
                return [{
                    _id: '1',
                    email: 'test1@test.com',
                    name: 'Test 1'
                },
                {
                    _id: '2',
                    email: 'test2@test.com',
                    name: 'Test 2'
                }]
            }
        }
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/users'
        })
        const res = httpMocks.createResponse();

        await handlers.getUsersRouteHandler(req, res, repo);

        assert.equal(Array.isArray(res._getData()), true);
    })
})

describe('getCurrentUserRouteHandler function', () => {
    it('should return a currently logged in user', async() => {
        const repo = {
            getUserById: () => {
                return {
                    _id: 1,
                    email: 'test1@test.com',
                    name: 'Test 1'
                }
            }
        }
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/users/current',
            user: {
                _id: '1'
            }
        })
        const res = httpMocks.createResponse();

        await handlers.getCurrentUserRouteHandler(req, res, repo);

        assert.deepEqual(res._getData(), {
            _id: 1,
            email: 'test1@test.com',
            name: 'Test 1'
        })
    })

    it('should return a 404 Not Found status code if the user does not exist', async() => {
        const repo = {
            getUserById: () => {
                return null;
            }
        }
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/users/current',
            user: {
                _id: '1'
            }
        })
        const res = httpMocks.createResponse();

        await handlers.getCurrentUserRouteHandler(req, res, repo);

        assert.equal(res.statusCode, 404);
    })
})

describe('getUserRouteHandler function', () => {
    it('should return a user with a given id', async() => {
        const repo = {
            getUserById: () => {
                return {
                    _id: 1,
                    email: 'test1@test.com',
                    name: 'Test 1'
                }
            }
        }
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/users',
            params: {
                id: '1'
            }
        })
        const res = httpMocks.createResponse();

        await handlers.getUserRouteHandler(req, res, repo);

        assert.deepEqual(res._getData(), {
            _id: 1,
            email: 'test1@test.com',
            name: 'Test 1'
        })
    })

    it('should return a 404 Not Found status code if the user does not exist', async() => {
        const repo = {
            getUserById: () => {
                return null;
            }
        }
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/users',
            params: {
                id: 'not-found'
            }
        })
        const res = httpMocks.createResponse();

        await handlers.getUserRouteHandler(req, res, repo);

        assert.equal(res.statusCode, 404);
    })
})

describe('insertUserRouteHandler function', () => {
    it('should reply with a message if the insert was successful', async() => {
        const repo = {
            insertUser: () => { return '1'; }
        }
        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/users/insert',
            body: {
                email: 'test@test.com',
                password: 'test',
                name: 'Test'
            }
        })
        const res = httpMocks.createResponse();

        const id = await handlers.insertUserRouteHandler(req, res, repo);

        assert.equal(res._getData(), 'Inserted a user with an id: 1');
    })
})

describe('deleteUserRouteHandler function', () => {
    it('should reply with a message if the deletion was successful', async() => {
        const repo = {
            deleteUser: () => {}
        }
        const req = httpMocks.createRequest({
            method: 'DELETE',
            url: '/users/delete',
            params: {
                id: '1'
            }
        })
        const res = httpMocks.createResponse();

        await handlers.deleteUserRouteHandler(req, res, repo);

        assert.equal(res._getData(), 'Deleted a user with an id: 1');
    })
})

describe('updateUserRouteHandler function', () => {
    it('should reply with a message if the update was successful', async() => {
        const repo = {
            updateUser: () => {}
        }
        const req = httpMocks.createRequest({
            method: 'PUT',
            url: '/users/update',
            params: {
                id: '1'
            },
            body: {
                email: 'test@test.com',
                name: 'Test'
            }
        })
        const res = httpMocks.createResponse();

        await handlers.updateUserRouteHandler(req, res, repo);

        assert.equal(res._getData(), 'Updated a user with an id: 1');
    })
})