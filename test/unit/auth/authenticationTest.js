const assert = require('assert');

const authentication = require('../../../auth/authentication');

describe('hashPassword function', () => {
    it('should produce a 60-character long hash', async() => {
        const plaintextPassword = 'anyPassword';

        const hash = await authentication.hashPassword(plaintextPassword);

        assert.equal(hash.length, 60);
    });
});

describe('login function', () => {
    it('should return null if user with a given email does not exist', async() => {
        const email = 'not-found@test.com';
        const password = 'pass123';
        const dependencies = {
            repo: {
                getUserByEmail: () => { return null; }
            },
            encodeAuthToken: () => {}
        }

        const result = await authentication.login(email, password, dependencies);

        assert.equal(result, null);
    });

    it('should return null if the email and password do not match', async() => {
        const email = 'wrong-password@test.com';
        const password = 'wrong';
        const dependencies = {
            repo: {
                getUserByEmail: () => {
                    return {
                        _id: '12345',
                        email: 'wrong-password@test.com',
                        password: '$2b$10$q6iFK0mOwZzG5T.9nM/71.ODJxLSoB8QOP8xXqqaZCxpm5BYxY3s2',
                        name: 'Test'
                    }
                }
            },
            encodeAuthToken: () => {}
        }

        const result = await authentication.login(email, password, dependencies);

        assert.equal(result, null);
    });

    it('should return user data and an access token if the email and password match', async() => {
        const email = 'test@test.com';
        const password = 'pass123';
        const dependencies = {
            repo: {
                getUserByEmail: () => {
                    return {
                        _id: '12345',
                        email: 'test@test.com',
                        password: '$2b$10$q6iFK0mOwZzG5T.9nM/71.ODJxLSoB8QOP8xXqqaZCxpm5BYxY3s2',
                        name: 'Test'
                    }
                }
            },
            encodeAuthToken: () => { return 'some-token-12345'; }
        }

        const result = await authentication.login(email, password, dependencies);

        assert.deepEqual(result, {
            _id: '12345',
            email: 'test@test.com',
            name: 'Test',
            authToken: 'some-token-12345'
        });
    });
});
