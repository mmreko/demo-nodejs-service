const getUsersRouteHandler = async(req, res, repo) => {
    try {
        const users = await repo.getUsers();
        res.send(users);
    } catch(error) {
        console.error(error);
        res.sendStatus(500);
    }
}

const getUserHandler = async(req, res, repo, id) => {
    try {
        const user = await repo.getUserById(id);
        if (!user) res.sendStatus(404);
        else res.send(user);
    } catch(error) {
        console.error(error);
        res.sendStatus(500);
    }
}

const getCurrentUserRouteHandler = async(req, res, repo) => {
    getUserHandler(req, res, repo, req.user);
}

const getUserRouteHandler = async(req, res, repo) => {
    getUserHandler(req, res, repo, req.params.id);
}

const insertUserRouteHandler = async(req, res, repo) => {
    try {
        const newUser = {
            email: req.body.email,
            password: req.body.password,
            name: req.body.name
        }
        const id = await repo.insertUser(newUser);
        res.send(`Inserted a user with an id: ${id}`);
    } catch(error) {
        console.error(error);
        res.sendStatus(500);
    }
}

const updateUserRouteHandler = async(req, res, repo) => {
    try {
        const modifiedUser = {
            email: req.body.email,
            name: req.body.name
        }
        await repo.updateUser(req.params.id, modifiedUser);
        res.send(`Updated a user with an id: ${req.params.id}`);
    } catch(error) {
        console.error(error);
        res.sendStatus(500);
    }
}

const deleteUserRouteHandler = async(req, res, repo) => {
    try {
        await repo.deleteUser(req.params.id);
        res.send(`Deleted a user with an id: ${req.params.id}`);
    } catch(error) {
        console.error(error);
        res.sendStatus(500);
    }
}

module.exports = {
    getUsersRouteHandler,
    getCurrentUserRouteHandler,
    getUserRouteHandler,
    insertUserRouteHandler,
    updateUserRouteHandler,
    deleteUserRouteHandler
}