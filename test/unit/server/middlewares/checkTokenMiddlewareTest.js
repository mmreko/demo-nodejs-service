const assert = require('assert');
const httpMocks = require('node-mocks-http');

const checkTokenMiddleware = require('../../../../server/middlewares/checkTokenMiddleware');
const encodeAuthToken = require('../../../../auth/authTokens').encodeAuthToken;

describe('checkTokenMiddleware function', () => {
    it('should write a user id to the request object if token is valid', async() => {
        const token = await encodeAuthToken('12345');
        const req = httpMocks.createRequest({
            method: 'GET',
            url: `/users/current`,
            headers: {
                'x-access-token': token
            }
        })
        const res = httpMocks.createResponse();
        const next = () => {};

        await checkTokenMiddleware(req, res, next);

        assert.equal(res.statusCode, 200);
        assert.equal(req.user, '12345');
    })

    it('should respond with status code 401 if token is invalid', async() => {
        const token = 'invalid-token';
        const req = httpMocks.createRequest({
            method: 'GET',
            url: `/users/current`,
            headers: {
                'x-access-token': token
            }
        })
        const res = httpMocks.createResponse();
        const next = () => {};

        await checkTokenMiddleware(req, res, next);

        assert.equal(res.statusCode, 401);
    })
})