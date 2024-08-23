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
    const values = keys.map(key => `'${attachmentItems[key]}'`).join(', ');
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

exports.getNotCompletedTasksAndUserInfo = async () => {
    const sql = `SELECT u.username AS username,
        u.email AS email,
        t.title AS task_title,
        t.assigned_to AS task_owner,
        t.due_date AS due_date
    FROM users u
    INNER JOIN tasks t ON u.id = t.assigned_to
    WHERE t.status IN ('in_progress', 'pending');`;

    return db.any(sql)
        .then(result => result)
        .catch(err => {
            throw new Error(err);
        } );
}

//TODO: editar query y poner al final WHERE DATE(t.created_at) = CURRENT_DATE
exports.getAdminDailyTasksReport = async () => {
    const sql = `SELECT t.id AS task_id,
        p.name AS project_name,
        wg.name AS workgroup_name,
        t.title AS task_title,
        t.description AS task_description,
        t.status AS task_status,
        u.username AS assigned_to,
        t.due_date AS task_due_date,
        t.created_at AS task_creation_date,
        t.updated_at AS task_update_date
    FROM tasks t
    INNER JOIN workgroups wg ON t.workgroup_id = wg.id
    INNER JOIN users u ON t.assigned_to = u.id
    INNER JOIN projects p ON t.project_id = p.id
    `;

    return db.any(sql)
        .then(result => result)
        .catch(err => {
            throw new Error(err);
        });
}

exports.getProjectManagerDailyTasksReport = async (projectId) => {
    const sql = `SELECT t.id AS task_id,
        p.name AS project_name,
        wg.name AS workgroup_name,
        t.title AS task_title,
        t.description AS task_description,
        t.status AS task_status,
        u.username AS assigned_to,
        t.due_date AS task_due_date,
        t.created_at AS task_creation_date,
        t.updated_at AS task_update_date
    FROM tasks t
    INNER JOIN workgroups wg ON t.workgroup_id = wg.id
    INNER JOIN users u ON t.assigned_to = u.id
    INNER JOIN projects p ON t.project_id = p.id
    WHERE DATE(t.created_at) = CURRENT_DATE AND t.project_id = ${projectId}`;
}

exports.getUsersByRole = async (role) => {
    const sql = `SELECT p.id AS project_id,
        p.name AS project_name,
        u.id AS user_id,
        u.username AS username,
        u.email AS email,
        u.role AS role
    FROM projects p
    INNER JOIN users u ON p.owner_id = u.id
    WHERE role = '${role}'`;

    return db.any(sql)
        .then(result => result)
        .catch(err => {
            throw new Error(err);
        });
}