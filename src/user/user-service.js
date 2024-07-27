const userRepository = require('./user-repository');

const getUserById = async (userId, next) => {
    try {
        const user = await userRepository.getUserById(userId, next);
        return user;
    }
    catch (err) {
        return next(err);
    }   
}

module.exports = {
    getUserById
}