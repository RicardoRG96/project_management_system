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

const getAllUserNotifications = async (userId, next) => {
    try {
        const notifications = await userRepository.getAllUserNotifications(userId, next);
        return notifications;
    }
    catch (err) {
        return next(err);
    }
}

const getOneNotification = async (userId, notificationId, next) => {
    try {
        const notification = await userRepository.getOneNotification(userId, notificationId, next);
        return notification;
    }
    catch (err) {
        return next(err);
    }
}

module.exports = {
    getUserById,
    getAllUserNotifications,
    getOneNotification
}