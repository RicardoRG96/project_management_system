const { db } = require('../../db/config');

exports.getUserByIdQuery = async (userId, next) => {
    const sql = `SELECT id, 
            username,
            email,
            role
        FROM users WHERE id = ${userId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

exports.getAllUserNotificationsQuery = async (userId, next) => {
    const sql = `SELECT * FROM notifications WHERE user_id = ${userId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

exports.getOneNotificationQuery = async (userId, notificationId, next) => {
    const sql = `SELECT * FROM notifications WHERE user_id = ${userId} AND id = ${notificationId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

exports.getAllUserHistoryCommentsQuery = async (userId, next) => {
    const sql = `SELECT * FROM comments WHERE user_id = ${userId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

exports.getOneUserHistoryCommentQuery = async (userId, commentId, next) => {
    const sql = `SELECT * FROM comments WHERE user_id = ${userId} AND id = ${commentId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

exports.getAllUserHistoryUploadedFilesQuery = async (userId, next) => {
    const sql = `SELECT * FROM attachments WHERE uploaded_by = ${userId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

exports.getOneUserHistoryUploadedfileQuery = async (userId, attachmentId, next) => {
    const sql = `SELECT * FROM attachments WHERE uploaded_by = ${userId} AND id = ${attachmentId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

exports.getAllUserHistoryProjectsQuery = async (userId, next) => {
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

exports.getOneUserHistoryProjectQuery = async (userId, projectId, next) => {
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

exports.getAllUserHistoryWorkgroupsQuery = async (userId, next) => {
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

exports.getOneUserHistoryWorkgroupQuery = async (userId, workgroupId, next) => {
    const sql = `SELECT w.id AS workgroup_id, 
        w.project_id AS project_id,
        w.name AS workgroup_name,
        w.leader_id AS technical_lead_id,
        w.created_at AS workgroup_creation_date,
        wm.user_id AS user_id
    FROM workgroups w
    INNER JOIN workgroupmembers wm ON w.id = wm.workgroup_id
    WHERE wm.user_id = ${userId} AND w.id = ${workgroupId}`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

exports.registerUserQuery = async (userSchema, next) => {
    const keys = Object.keys(userSchema);
    const properties = keys.join(', ');
    const values = keys.map(key => `'${userSchema[key]}'`).join(', ');
    const sql = `INSERT INTO users (${properties}) VALUES (${values}) RETURNING *`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

exports.findUserQuery = async (userName, email, next) => {
    const sql = `SELECT * FROM users WHERE username = '${userName}' OR email = '${email}'`;

    return db.any(sql)
        .then(result => result)
        .catch(err => next(err))
}

exports.changeUserPermissions = async (userId, newRole) => {
    const sql = `UPDATE users SET role = '${newRole}' WHERE id = ${userId} RETURNING *`;

    return db.any(sql)
        .then(result => result)
        .catch(err => { 
            throw new Error(err)
        })
}

exports.createUserNotifications = async (userId) => {
    const sql = `INSERT INTO notifications (user_id, message, read) 
        VALUES (${userId}, 'You have been assigned a new task: Design Homepage', false) RETURNING *`;

    return db.any(sql)
        .then(result => result)
        .catch(err => { 
            throw new Error(err)
        })
}

exports.createUserComment = async (userId) => {
    const sql = `INSERT INTO comments (task_id, user_id, content) 
        VALUES (1, ${userId}, 'I have completed the initial design. Please review and provide feedback.') RETURNING *`;

    return db.any(sql)
        .then(result => result)
        .catch(err => { 
            throw new Error(err)
        })
}

exports.createUserAttachment = async (userId) => {
    const sql = `INSERT INTO attachments (task_id, filename, file_path, uploaded_by) 
        VALUES (1, 'api_documentation.pdf', '/uploads/api_documentation.pdf', ${userId}) RETURNING *`;

    return db.any(sql)
        .then(result => result)
        .catch(err => { 
            throw new Error(err)
        })
}

exports.createProjectMember = async (userId) => {
    const sql = `INSERT INTO projectmembers (project_id, user_id, role) 
        VALUES (1, ${userId}, 'team_member') RETURNING *`;

    return db.any(sql)
        .then(result => result)
        .catch(err => { 
            throw new Error(err)
        })
}

exports.createWorkGroupMember = async (userId) => {
    const sql = `INSERT INTO workgroupmembers (user_id, workgroup_id) VALUES (${userId}, 1);`

    return db.any(sql)
        .then(result => result)
        .catch(err => { 
            throw new Error(err)
        })
}