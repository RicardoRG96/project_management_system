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

async function getOneUserHistoryProjectQuery(userId, projectId, next) {
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
    WHERE pm.user_id = ${userId} AND p.id = ${projectId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

async function getAllUserHistoryWorkGroupsQuery(userId, next) {
    const sql = `SELECT w.id AS workgroup_id, 
        w.project_id AS project_id,
        w.name AS workgroup_name,
        w.leader_id AS technical_lead_id,
        w.created_at AS workgroup_creation_date,
        wm.user_id AS user_id
    FROM workgroups w
    INNER JOIN workgroupmembers wm ON w.id = wm.workgroup_id
    WHERE wm.user_id = ${userId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

async function registerUserQuery(userSchema, next) {
    const keys = Object.keys(userSchema);
    const properties = keys.join(', ');
    const values = keys.map(key => `'${userSchema[key]}'`).join(', ');
    const sql = `INSERT INTO users (${properties}) VALUES (${values}) RETURNING *`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

async function findUserQuery(userName, email, next) {
    const sql = `SELECT * FROM users WHERE username = '${userName}' OR email = '${email}'`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

async function changeUserPermissions(userId, newRole) {
    const sql = `UPDATE users SET role = '${newRole}' WHERE id = ${userId} RETURNING *`;

    return db.any(sql)
        .then(result => result)
        .catch(err => { 
            throw new Error(err)
        })
}

async function createUserNotifications(userId) {
    const sql = `INSERT INTO notifications (user_id, message, read) 
        VALUES (${userId}, 'You have been assigned a new task: Design Homepage', false) RETURNING *`;

    return db.any(sql)
        .then(result => result)
        .catch(err => { 
            throw new Error(err)
        })
}

async function createUserComment(userId) {
    const sql = `INSERT INTO comments (task_id, user_id, content) 
        VALUES (1, ${userId}, 'I have completed the initial design. Please review and provide feedback.') RETURNING *`;

    return db.any(sql)
        .then(result => result)
        .catch(err => { 
            throw new Error(err)
        })
}

async function createUserAttachment(userId) {
    const sql = `INSERT INTO attachments (task_id, filename, file_path, uploaded_by) 
        VALUES (1, 'api_documentation.pdf', '/uploads/api_documentation.pdf', ${userId}) RETURNING *`;

    return db.any(sql)
        .then(result => result)
        .catch(err => { 
            throw new Error(err)
        })
}

async function createProjectMember(userId) {
    const sql = `INSERT INTO projectmembers (project_id, user_id, role) 
        VALUES (1, ${userId}, 'team_member') RETURNING *`;

    return db.any(sql)
        .then(result => result)
        .catch(err => { 
            throw new Error(err)
        })
}

async function createWorkGroupMember(userId) {
    const sql = `INSERT INTO workgroupmembers (user_id, workgroup_id) VALUES (${userId}, 1);`

    return db.any(sql)
        .then(result => result)
        .catch(err => { 
            throw new Error(err)
        })
}

module.exports = {
    getUserByIdQuery,
    getAllUserNotificationsQuery,
    getOneNotificationQuery,
    getAllUserHistoryCommentsQuery,
    getOneUserHistoryCommentQuery,
    getAllUserHistoryUploadedFilesQuery,
    getOneUserHistoryUploadedfileQuery,
    getAllUserHistoryProjectsQuery,
    getOneUserHistoryProjectQuery,
    registerUserQuery,
    findUserQuery,
    changeUserPermissions,
    createUserNotifications,
    createUserComment,
    createUserAttachment,
    createProjectMember,
    getAllUserHistoryWorkGroupsQuery,
    createWorkGroupMember
}