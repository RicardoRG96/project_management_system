const userService = require('./user-service');

const getOneUser = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const user = await userService.getUserById(userId, next);
        if (!user.length) {
            return res.sendStatus(404);
        } 
        return res.status(200).json(user);
    }   
    catch (err) {
        return next(err);
    }
}

const getAllUserNotifications = async (req, res ,next) => {
    const userId = req.params.userId;
    try {
        const notifications = await userService.getAllUserNotifications(userId, next);
        if (!notifications.length) {
            return res.sendStatus(404);
        }
        return res.status(200).json(notifications);
    }
    catch (err) {
        return next(err);
    }
}

const getOneNotification = async (req, res, next) => {
    const { userId, notificationId } = req.params;
    try {
        const notification = await userService.getOneNotification(userId, notificationId, next);
        if (!notification.length) {
            return res.sendStatus(404);
        }
        return res.status(200).json(notification);
    }
    catch (err) {
        return next(err);
    }
}

module.exports = {
    getOneUser,
    getAllUserNotifications,
    getOneNotification
}