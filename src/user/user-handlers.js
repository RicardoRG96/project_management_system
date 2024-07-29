const userService = require('./user-service');

const getOneUserHandler = async (req, res, next) => {
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

const getAllUserNotificationsHandler = async (req, res ,next) => {
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

const getOneNotificationHandler = async (req, res, next) => {
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

const getAllUserHistoryCommentsHandler = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const comments = await userService.getAllUserHistoryComments(userId, next);
        if (!comments.length) {
            return res.sendStatus(404);
        }
        return res.status(200).json(comments);
    }
    catch (err) {
        return next(err);
    }
}

module.exports = {
    getOneUserHandler,
    getAllUserNotificationsHandler,
    getOneNotificationHandler,
    getAllUserHistoryCommentsHandler
}