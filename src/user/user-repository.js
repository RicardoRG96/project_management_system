const { db } = require('../../db/config');

async function getUserById(userId, next) {
    const sql = `SELECT id, 
            username,
            email,
            role
        FROM users WHERE id = ${userId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

async function getAllUserNotifications(userId, next) {
    const sql = `SELECT * FROM notifications WHERE user_id = ${userId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

async function getOneNotification(userId, notificationId, next) {
    const sql = `SELECT * FROM notifications WHERE user_id = ${userId} AND id = ${notificationId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

module.exports = {
    getUserById,
    getAllUserNotifications,
    getOneNotification
}