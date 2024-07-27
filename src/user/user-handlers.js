const userService = require('./user-service');

const getOneUser = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const user = await userService.getUserById(userId, next);
        if (!user.length) {
            return res.sendStatus(404);
        } else {
            return res.status(200).json(user);
        }
    }
    catch (err) {
        return next(err);
    }
}

module.exports = {
    getOneUser
}