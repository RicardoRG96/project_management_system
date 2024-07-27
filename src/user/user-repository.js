const { db } = require('../../db/config');

async function getUserById(userId, next) {
    const sql = `SELECT * FROM users WHERE id = ${userId}`;

    return db.any(sql)
        .then(result => {
            return result
        })
        .catch(err => {
            return next(err);
        })
}

module.exports = {
    getUserById
}