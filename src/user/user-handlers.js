const userService = require('./user-service');

const getOneUser = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const user = userService.getUserById(userId);
        return res.status(200).json({ data: user });
    }
    catch (err) {
        return next(err);
    }
}

module.exports = {
    getOneUser
}