const session = require('supertest-session');

const startServer = require('../../../server/server');
const serverOptions = require('../../../config/serverOptions');
const connectToStaticRepo = require('../../../data/static/staticRepo');

let testSession = null;

before(async() => {
    serverOptions.connectToRepo = connectToStaticRepo;
    const app = await startServer(serverOptions);
    testSession = session(app);
});

describe('Basic API', function () {

    describe('GET /', () => {
        describe('when a user is not authenticated', () => {
            it('should return a generic message', (done) => {
                testSession
                    .get('/')
                    .expect(200)
                    .expect('Hello, Stranger!')
                    .end(done);
            });
        })
        describe('when a user is authenticated', () => {
            let authenticatedSession;

            beforeEach((done) => {
                testSession.post('/login')
                    .send({ email: 'jaime.lannister@crock.com', password: 'pass123' })
                    .expect(200)
                    .end((error) => {
                        if (error) return done(error);
                        authenticatedSession = testSession;
                        return done();
                    });
            });

            it('should return a personalized message', (done) => {
                authenticatedSession
                    .get('/')
                    .expect(200)
                    .expect('Hello, Jaime Lannister!')
                    .end(done);
            })

            afterEach((done) => {
                authenticatedSession
                    .get('/logout')
                    .expect(302)
                    .end(done)
            })
        })
    })

    describe('POST /login', () => {
        describe('if the login was successful', () => {
            it('should return a personalized message', (done) => {
                testSession.post('/login')
                    .send({ email: 'jaime.lannister@crock.com', password: 'pass123' })
                    .expect(200)
                    .expect('Welcome Jaime Lannister!')
                    .end(done);
            })
        })

        describe('if the login was not successful', () => {
            it('should return an error message', (done) => {
                testSession.post('/login')
                    .send({ email: 'jaime.lannister@crock.com', password: 'wrong' })
                    .expect(200)
                    .expect('Email or password is incorrect!')
                    .end(done);
            })
        })
    })

    describe('GET /logout', () => {
        it('should return status 302 Found', (done) => {
            testSession
                .get('/logout')
                .expect(302)
                .end(done)
        })
    })

    describe('any other path', () => {
        it('should return status 404 Not Found', (done) => {
            testSession
                .get('/not-found')
                .expect(404)
                .end(done)
        })
    })

});

describe('Users API', function () {

    describe('GET /users', () => {
        it('should return an array of json objects', (done) => {
            testSession
                .get('/users')
                .expect(200)
                .expect('Content-Type', /json/)
                .expect((res) => Array.isArray(res))
                .end(done);
        });
    })

    describe('GET /users/current', () => {
        describe('if the authorization token is not present', () => {
            it('should return status 401 Unauthorized', (done) => {
                testSession
                    .get('/users/current')
                    .expect(401)
                    .end(done);
            });
        })
        describe('if the authorization token is present', () => {
            let authenticatedSession;
            let token;

            beforeEach((done) => {
                testSession.post('/login')
                    .send({ email: 'jaime.lannister@crock.com', password: 'pass123' })
                    .expect(200)
                    .end((error, res) => {
                        if (error) return done(error);
                        authenticatedSession = testSession;
                        token = res.headers['x-auth-token'];
                        return done();
                    });
            });

            it('should return a currently logged in user as a json object', (done) => {
                testSession
                    .get('/users/current')
                    .set('authorization', token)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(done);
            })

            afterEach((done) => {
                authenticatedSession
                    .get('/logout')
                    .expect(302)
                    .end(done)
            })
        })
    })

    describe('GET /users/:id', () => {
        describe('if the user with the provided ID exists', () => {
            it('should return a user as a json object', (done) => {
                testSession
                    .get('/users/70f7eaf9-99d8-4e70-838d-997ed93695c6')
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(done);
            })
        })
        describe('if the user with the provided ID does not exist', () => {
            it('should return status 404 Not Found', (done) => {
                testSession
                    .get('/users/does-not-exist')
                    .expect(404)
                    .end(done)
            })
        })
    })

    describe('POST /users/insert', () => {
        it('should return a text message with the insertion summary', (done) => {
            testSession
                .post('/users/insert')
                .send({ email: 'test@test.com', password: 'test', name: 'Test' })
                .expect(200)
                .expect('Content-Type', /text/)
                .end(done);
        })
    })

    describe('PUT /users/update', () => {
        it('should return a text message with the update summary', (done) => {
            testSession
                .put('/users/update/70f7eaf9-99d8-4e70-838d-997ed93695c6')
                .send({ email: 'updated@test.com', name: 'Updated' })
                .expect(200)
                .expect('Content-Type', /text/)
                .end(done);
        })
    })

    describe('DELETE /users/delete', () => {
        it('should return a text message with the deletion summary', (done) => {
            testSession
                .delete('/users/delete/70f7eaf9-99d8-4e70-838d-997ed93695c6')
                .expect(200)
                .expect('Content-Type', /text/)
                .end(done);
        })
    })
})