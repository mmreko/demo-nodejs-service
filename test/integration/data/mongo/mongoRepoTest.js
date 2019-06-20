const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');

const connectToMongoRepo = require('../../../../data/mongo/mongoRepo');

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

describe('MongoDB repo', () => {

    let mongoRepo = null;
    let insertedIds = null;

    before(async() => {
        mongoRepo = await connectToMongoRepo();
    })

    beforeEach(async() => {
        const result = await mongoRepo.db.collection('users').insertMany([testUser1, testUser2]);
        insertedIds = result.insertedIds;
        testUser1._id = insertedIds[0];
        testUser2._id = insertedIds[1];
    })

    describe('getUsers function', () => {
        it('should return an array of users', async() => {
            const users = await mongoRepo.getUsers();

            assert.equal(Array.isArray(users), true);
            assert.notEqual(users.length, 0);
        })
    })

    describe('getUserById function', () => {
        it('should return a user if the given id exists', async() => {
            const user = await mongoRepo.getUserById(insertedIds[0]);

            assert.deepEqual(user, testUser1);
        })
        it('should return null if the given id does not exist', async() => {
            const user = await mongoRepo.getUserById('not-found');

            assert.equal(user, null);
        })
    })

    describe('getUserByEmail function', () => {
        it('should return a user if the given email exists', async() => {
            const user = await mongoRepo.getUserByEmail('test1@test.com');

            assert.deepEqual(user, testUser1);
        })
        it('should return null if the given email does not exist', async() => {
            const user = await mongoRepo.getUserByEmail('not-found');

            assert.equal(user, null);
        })
    })

    describe('insertUser function', () => {
        it('should add a new user to the database', async() => {
            const usersBefore = await mongoRepo.getUsers();
            const numUsersBefore = usersBefore.length;

            insertedIds[2] = await mongoRepo.insertUser(testUser3);
            const usersAfter = await mongoRepo.getUsers();
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

            await mongoRepo.updateUser(insertedIds[1], toUpdate);
            const updatedUser = await mongoRepo.getUserById(insertedIds[1]);

            assert.equal(updatedUser.email, 'test2@test.com');
            assert.equal(updatedUser.name, 'Updated name');
        })
    })

    describe('deleteUser function', () => {
        it('should delete a user from the database', async() => {
            const usersBefore = await mongoRepo.getUsers();
            const numUsersBefore = usersBefore.length;

            await mongoRepo.deleteUser(insertedIds[0]);
            const usersAfter = await mongoRepo.getUsers();
            const numUsersAfter = usersAfter.length;

            assert.equal(numUsersAfter, numUsersBefore - 1);
        })
    })

    afterEach(async() => {
        Object.keys(insertedIds).forEach(async(index) => {
            await mongoRepo.db.collection('users').deleteOne({ _id: ObjectID(insertedIds[index]) });
        })
    })

    after(async() => {
        await mongoRepo.disconnect();
    })
})