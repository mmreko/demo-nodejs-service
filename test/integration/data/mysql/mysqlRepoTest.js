const uuid = require('uuid/v4');
const assert = require('assert');

const connectToMySqlRepo = require('../../../../data/mysql/mysqlRepo');

const testUser1 = {
    email: 'test1@test.com',
    password: 'test',
    name: 'Test 1',
    type: 'mysql'
}
const testUser2 = {
    email: 'test2@test.com',
    password: 'test',
    name: 'Test 2',
    type: 'mysql'
}
const testUser3 = {
    email: 'test3@test.com',
    password: 'test',
    name: 'Test 3',
    type: 'mysql'
}

describe('MySql repo', () => {

    let mysqlRepo = null;
    let insertedIds = null;

    before(async() => {
        mysqlRepo = await connectToMySqlRepo();
    })

    beforeEach(async() => {
        insertedIds = [uuid(), uuid()];
        await mysqlRepo.pool.query(`INSERT INTO users (_id, email, password, name) VALUES ('${insertedIds[0]}', '${testUser1.email}', '${testUser1.password}', '${testUser1.name}')`);
        await mysqlRepo.pool.query(`INSERT INTO users (_id, email, password, name) VALUES ('${insertedIds[1]}', '${testUser2.email}', '${testUser2.password}', '${testUser2.name}')`);
        testUser1._id = insertedIds[0];
        testUser2._id = insertedIds[1];
    })

    describe('getUsers function', () => {
        it('should return an array of users', async() => {
            const users = await mysqlRepo.getUsers();

            assert.equal(Array.isArray(users), true);
            assert.notEqual(users.length, 0);
        })
    })

    describe('getUserById function', () => {
        it('should return a user if the given id exists', async() => {
            const user = await mysqlRepo.getUserById(insertedIds[0]);

            assert.deepEqual(user, testUser1);
        })
        it('should return null if the given id does not exist', async() => {
            const user = await mysqlRepo.getUserById('not-found');

            assert.equal(user, null);
        })
    })

    describe('getUserByEmail function', () => {
        it('should return a user if the given email exists', async() => {
            const user = await mysqlRepo.getUserByEmail('test1@test.com');

            assert.deepEqual(user, testUser1);
        })
        it('should return null if the given email does not exist', async() => {
            const user = await mysqlRepo.getUserByEmail('not-found');

            assert.equal(user, null);
        })
    })

    describe('insertUser function', () => {
        it('should add a new user to the database', async() => {
            const usersBefore = await mysqlRepo.getUsers();
            const numUsersBefore = usersBefore.length;

            insertedIds[2] = await mysqlRepo.insertUser(testUser3);
            const usersAfter = await mysqlRepo.getUsers();
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

            await mysqlRepo.updateUser(insertedIds[1], toUpdate);
            const updatedUser = await mysqlRepo.getUserById(insertedIds[1]);

            assert.equal(updatedUser.email, 'test2@test.com');
            assert.equal(updatedUser.name, 'Updated name');
        })
    })

    describe('deleteUser function', () => {
        it('should delete a user from the database', async() => {
            const usersBefore = await mysqlRepo.getUsers();
            const numUsersBefore = usersBefore.length;

            await mysqlRepo.deleteUser(insertedIds[0]);
            const usersAfter = await mysqlRepo.getUsers();
            const numUsersAfter = usersAfter.length;

            assert.equal(numUsersAfter, numUsersBefore - 1);
        })
    })

    afterEach(async() => {
        insertedIds.forEach(async(id) => {
            await mysqlRepo.pool.query(`DELETE FROM users WHERE _id='${id}'`);
        })
    })

    after(async() => {
        await mysqlRepo.disconnect();
    })
})