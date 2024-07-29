const userService = require('./user-service');

const getOneUserHandler = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const user = await userService.getUserByIdService(userId, next);
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
        const notifications = await userService.getAllUserNotificationsService(userId, next);
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
        const notification = await userService.getOneNotificationService(userId, notificationId, next);
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
        const comments = await userService.getAllUserHistoryCommentsService(userId, next);
        if (!comments.length) {
            return res.sendStatus(404);
        }
        return res.status(200).json(comments);
    }
    catch (err) {
        return next(err);
    }
}

const getOneUserHistoryCommentHandler = async (req, res, next) => {
    const { userId, commentId } = req.params;
    try {
        const comment = await userService.getOneUserHistoryCommentService(userId, commentId, next);
        if (!comment.length) {
            return res.sendStatus(404);
        }
        return res.status(200).json(comment);
    }
    catch (err) {
        return next(err);
    }
}

const getAllUserHistoryUploadedFilesHandler = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const files = await userService.getAllUserHistoryUploadedFilesService(userId, next);
        if (!files.length) {
            return res.sendStatus(404);
        }   
        return res.status(200).json(files);
    }
    catch (err) {
        return next(err);
    }
}

const getOneUserHistoryUploadedfileHandler = async (req, res, next) => {
    const { userId, attachmentId } = req.params;
    try {
        const file = await userService.getOneUserHistoryUploadedfileService(userId, attachmentId);
        if (!file.length) {
            return res.sendStatus(404);
        }
        return res.status(200).json(file);
    }
    catch (err) {
        return next(err);
    }
}

const getAllUserHistoryProjectsHandler = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const projects = await userService.getAllUserHistoryProjectsService(userId, next);
        if (!projects.length) {
            return res.sendStatus(404);
        }
        return res.status(200).json(projects);
    }
    catch (err) {
        return next(err);
    }
}

module.exports = {
    getOneUserHandler,
    getAllUserNotificationsHandler,
    getOneNotificationHandler,
    getAllUserHistoryCommentsHandler,
    getOneUserHistoryCommentHandler,
    getAllUserHistoryUploadedFilesHandler,
    getOneUserHistoryUploadedfileHandler,
    getAllUserHistoryProjectsHandler
}