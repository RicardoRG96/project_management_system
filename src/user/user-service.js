const userRepository = require('./user-repository');

const getUserByIdService = async (userId, next) => {
    try {
        const user = await userRepository.getUserByIdQuery(userId, next);
        return user;
    }
    catch (err) {
        return next(err);
    }   
}

const getAllUserNotificationsService = async (userId, next) => {
    try {
        const notifications = await userRepository.getAllUserNotificationsQuery(userId, next);
        return notifications;
    }
    catch (err) {
        return next(err);
    }
}

const getOneNotificationService = async (userId, notificationId, next) => {
    try {
        const notification = await userRepository.getOneNotificationQuery(userId, notificationId, next);
        return notification;
    }
    catch (err) {
        return next(err);
    }
}

const getAllUserHistoryCommentsService = async (userId, next) => {
    try {
        const comments = await userRepository.getAllUserHistoryCommentsQuery(userId, next);
        return comments;
    }
    catch (err) {
        return next(err);
    }
}

const getOneUserHistoryCommentService = async (userId, commentId, next) => {
    try {
        const comment = await userRepository.getOneUserHistoryCommentQuery(userId, commentId, next);
        return comment;
    }
    catch (err) {
        return next(err);
    }
}

const getAllUserHistoryUploadedFilesService = async (userId, next) => {
    try {
        const files = await userRepository.getAllUserHistoryUploadedFilesQuery(userId, next);
        return files;
    }
    catch (err) {
        return next(err);
    }
}

const getOneUserHistoryUploadedfileService = async (userId, attachmentId, next) => {
    try {
        const file = await userRepository.getOneUserHistoryUploadedfileQuery(userId, attachmentId, next);
        return file;
    }
    catch (err) {
        return next(err);
    }
}

const getAllUserHistoryProjectsService = async (userId, next) => {
    try {
        const projects = await userRepository.getAllUserHistoryProjectsQuery(userId, next);
        return projects;
    }
    catch (err) {
        return next(err);
    }
}

module.exports = {
    getUserByIdService,
    getAllUserNotificationsService,
    getOneNotificationService,
    getAllUserHistoryCommentsService,
    getOneUserHistoryCommentService,
    getAllUserHistoryUploadedFilesService,
    getOneUserHistoryUploadedfileService,
    getAllUserHistoryProjectsService
}