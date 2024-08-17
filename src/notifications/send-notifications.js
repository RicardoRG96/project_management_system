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