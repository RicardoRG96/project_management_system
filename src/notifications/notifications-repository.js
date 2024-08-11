const { db } = require('../../db/config');

exports.createNotificationQuery = async (userId, message, next) => {
    const sql = `INSERT INTO notifications (user_id, message, read) VALUES (${userId}, '${message}', 'false')
        RETURNING *`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}