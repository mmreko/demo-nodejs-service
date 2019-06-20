const uuid = require('uuid/v4');
const assert = require('assert');

const connectToStaticRepo = require('../../../../data/static/staticRepo');

const testUser1 = {
    email: 'test1@test.com',
    password: 'test',
    name: 'Test 1',
    type: 'mongo'
}
const testUser2 = {
    email: 'test2@test.com',
    password: 'test',
    name: 'Test 2',
    type: 'mongo'
}
const testUser3 = {
    email: 'test3@test.com',
    password: 'test',
    name: 'Test 3',
    type: 'mongo'
}

describe('Static repo', () => {

    let staticRepo = null;
    let insertedIds = null;

    before(async() => {
        staticRepo = await connectToStaticRepo();
    })

    beforeEach(async() => {
        insertedIds = [uuid(), uuid()];
        testUser1._id = insertedIds[0];
        testUser2._id = insertedIds[1];
        staticRepo.users.push(testUser1);
        staticRepo.users.push(testUser2);
    })

    describe('getUsers function', () => {
        it('should return an array of users', async() => {
            const users = await staticRepo.getUsers();

            assert.equal(Array.isArray(users), true);
            assert.notEqual(users.length, 0);
        })
    })

    describe('getUserById function', () => {
        it('should return a user if the given id exists', async() => {
            const user = await staticRepo.getUserById(insertedIds[0]);

            assert.deepEqual(user, testUser1);
        })
        it('should return null if the given id does not exist', async() => {
            const user = await staticRepo.getUserById('not-found');

            assert.equal(user, null);
        })
    })

    describe('getUserByEmail function', () => {
        it('should return a user if the given email exists', async() => {
            const user = await staticRepo.getUserByEmail('test1@test.com');

            assert.deepEqual(user, testUser1);
        })
        it('should return null if the given email does not exist', async() => {
            const user = await staticRepo.getUserByEmail('not-found');

            assert.equal(user, null);
        })
    })

    describe('insertUser function', () => {
        it('should add a new user to the database', async() => {
            const usersBefore = await staticRepo.getUsers();
            const numUsersBefore = usersBefore.length;

            insertedIds[2] = await staticRepo.insertUser(testUser3);
            const usersAfter = await staticRepo.getUsers();
            const numUsersAfter = usersAfter.length;

            assert.equal(numUsersAfter, numUsersBefore + 1);
        })
    })

    describe('updateUser function', () => {
        it('should update the changed fields of a user', async() => {
            const toUpdate = {
                email: 'test2@test.com',
                name: 'Updated name'
            }

            await staticRepo.updateUser(insertedIds[1], toUpdate);
            const updatedUser = await staticRepo.getUserById(insertedIds[1]);

            assert.equal(updatedUser.email, 'test2@test.com');
            assert.equal(updatedUser.name, 'Updated name');
        })
    })

    describe('deleteUser function', () => {
        it('should delete a user from the database', async() => {
            const usersBefore = await staticRepo.getUsers();
            const numUsersBefore = usersBefore.length;

            await staticRepo.deleteUser(insertedIds[0]);
            const usersAfter = await staticRepo.getUsers();
            const numUsersAfter = usersAfter.length;

            assert.equal(numUsersAfter, numUsersBefore - 1);
        })
    })

    afterEach(async() => {
        insertedIds.forEach(id => {
            staticRepo.users = staticRepo.users.filter(user => user._id !== id);
        })
    })

    after(async() => {
        await staticRepo.disconnect();
    })
})