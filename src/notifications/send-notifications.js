const socketapi = require('../../socket');
const notificationRepository = require('../notifications/notifications-repository');

exports.sendInAppNotification = async (userId, message, next) => {
    try {
        const notification = await notificationRepository.createNotificationQuery(userId, message, next);
        socketapi.io.to(userId).emit('notification', notification);
    }
    catch (err) {
        return next(err);
    }
}

exports.sendCriticalErrorNotification = async (userId) => {
    try {
        const message = 'Se ha encontrado un error crítico en la aplicación';
        const notification = await notificationRepository.createNotificationQuery(userId, message, next);
        socketapi.io.to(userId).emit('notification', notification);
    }
    catch (err) {
        throw new Error(err);
    }
}