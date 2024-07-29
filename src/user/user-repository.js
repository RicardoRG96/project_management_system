const { db } = require('../../db/config');

async function getUserByIdQuery(userId, next) {
    const sql = `SELECT id, 
            username,
            email,
            role
        FROM users WHERE id = ${userId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

async function getAllUserNotificationsQuery(userId, next) {
    const sql = `SELECT * FROM notifications WHERE user_id = ${userId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

async function getOneNotificationQuery(userId, notificationId, next) {
    const sql = `SELECT * FROM notifications WHERE user_id = ${userId} AND id = ${notificationId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

async function getAllUserHistoryCommentsQuery(userId, next) {
    const sql = `SELECT * FROM comments WHERE user_id = ${userId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

async function getOneUserHistoryCommentQuery(userId, commentId, next) {
    const sql = `SELECT * FROM comments WHERE user_id = ${userId} AND id = ${commentId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

async function getAllUserHistoryUploadedFilesQuery(userId, next) {
    const sql = `SELECT * FROM attachments WHERE uploaded_by = ${userId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

async function getOneUserHistoryUploadedfileQuery(userId, attachmentId, next) {
    const sql = `SELECT * FROM attachments WHERE uploaded_by = ${userId} AND id = ${attachmentId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

async function getAllUserHistoryProjectsQuery(userId, next) {
    const sql = `SELECT p.id AS project_id,
        p.name AS project_name,
        p.description AS project_description,
        p.owner_id AS project_manager_id,
        u.username AS project_manager_name,
        p.created_at AS project_creation_date,
        pm.user_id AS user_id,
        pm.role AS user_role,
        pm.joined_at AS user_incorporation_date
    FROM projects p
    INNER JOIN projectmembers pm ON p.id = pm.project_id
    INNER JOIN users u ON p.owner_id = u.id
    WHERE pm.user_id = ${userId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

module.exports = {
    getUserByIdQuery,
    getAllUserNotificationsQuery,
    getOneNotificationQuery,
    getAllUserHistoryCommentsQuery,
    getOneUserHistoryCommentQuery,
    getAllUserHistoryUploadedFilesQuery,
    getOneUserHistoryUploadedfileQuery,
    getAllUserHistoryProjectsQuery
}