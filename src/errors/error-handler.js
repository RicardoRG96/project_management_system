const logger = require('./logger');
const { sendCriticalErrorNotification } = require('../notifications/send-notifications');
const { getUsersByRole } = require('../tasks/tasks-repository');
const { sendEmail } = require('../../scheduled-jobs/email-sending-service');

exports.handleError = async (err) => {
    logger.loggerError(err);
    const adminUsers = await getUsersByRole('admin');
    adminUsers.map(admin => {
        sendCriticalErrorNotification(admin.user_id);
        const to = admin.email;
        const subject = 'Error crítico encontrado en la aplicación';
        const text = `Hola${admin.username}, Se ha encontrado un error crítico en la aplicación`;
        sendEmail(to, subject, text);
    });
}