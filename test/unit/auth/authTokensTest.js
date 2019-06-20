const assert = require('assert');

const authTokens = require('../../../auth/authTokens');

describe('encodeAuthToken function', () => {
    it('should produce a non-empty authentication token for a given id', async() => {
        const id = '12345';

        const authToken = await authTokens.encodeAuthToken(id);

        assert.notEqual(authToken.length, 0);
    });
});

describe('decodeAuthToken function', () => {
    it('should return null if the token does not exist', async() => {
        const result = await authTokens.decodeAuthToken(null);

        assert.equal(result, null);
    });

    it('should return null if the token is invalid', async() => {
        const invalidToken = 'invalid';
        const result = await authTokens.decodeAuthToken(invalidToken);

        assert.equal(result, null);
    });

    it('should return a decoded token if the token is valid', async() => {
        const validToken = await authTokens.encodeAuthToken('12345');
        const result = await authTokens.decodeAuthToken(validToken);

        assert.deepEqual(Object.keys(result), [ '_id', 'iat', 'exp' ]);
        assert.equal(result._id, '12345');
    });
});