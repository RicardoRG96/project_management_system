const { db } = require('../../db/config');

exports.createTaskQuery = async (taskItems, next) => {
    const keys = Object.keys(taskItems);
    const properties = keys.join(', ');
    const values = keys.map(key => `'${taskItems[key]}'`).join(', ');
    const sql = `INSERT INTO tasks (${properties}) VALUES (${values}) RETURNING *`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err));
}

exports.createCommentQuery = async (commentItems, next) => {
    const keys = Object.keys(commentItems);
    const properties = keys.join(', ');
    const values = keys.map(key => `'${commentItems[key]}'`).join(', ');
    const sql = `INSERT INTO comments (${properties}) VALUES (${values}) RETURNING *`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err));
}

exports.createAttachmentQuery = async (attachmentItems, next) => {
    const keys = Object.keys(attachmentItems);
    const properties = keys.join(', ');
    const values = properties.map(key => `'${attachmentItems[key]}'`).join(', ');
    const sql = `INSERT INTO attachments (${properties}) VALUES (${values}) RETURNING *`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err));
}

exports.getTaskById = async (taskId, next) => {
    const sql = `SELECT * FROM tasks WHERE id = ${taskId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err));
}

exports.getUserById = async (userId, next) => {
    const sql = `SELECT * FROM users WHERE id = ${userId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err));
}