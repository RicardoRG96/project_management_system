const path = require('node:path');
const fs = require('node:fs');
const { db } = require('../db/config');
const app = require('../app');
const request = require('supertest');

exports.resetDataBaseTables = async () => {
    const resetUsersTable = fs.readFileSync(
        path.join(__dirname, '../scripts/reset/reset_users.sql')
    ).toString();

    const resetNotificationsTable = fs.readFileSync(
        path.join(__dirname, '../scripts/reset/reset_notifications.sql')
    ).toString();

    const resetProjectsTable = fs.readFileSync(
        path.join(__dirname, '../scripts/reset/reset_projects.sql')
    ).toString();

    const resetWorkgroupsTable = fs.readFileSync(
        path.join(__dirname, '../scripts/reset/reset_workgroups.sql')
    ).toString();

    const resetTasksTable = fs.readFileSync(
        path.join(__dirname, '../scripts/reset/reset_tasks.sql')
    ).toString();

    const resetCommentsTable = fs.readFileSync(
        path.join(__dirname, '../scripts/reset/reset_comments.sql')
    ).toString();

    const resetAttachmentsTable = fs.readFileSync(
        path.join(__dirname, '../scripts/reset/reset_attachments.sql')
    ).toString();

    const resetProjectMembersTable = fs.readFileSync(
        path.join(__dirname, '../scripts/reset/reset_projectMembers.sql')
    ).toString();

    const resetWorkgroupMembersTable = fs.readFileSync(
        path.join(__dirname, '../scripts/reset/reset_workgroupmembers.sql')
    ).toString();

    await db.none(resetUsersTable);
    await db.none(resetNotificationsTable);
    await db.none(resetProjectsTable);
    await db.none(resetWorkgroupsTable);
    await db.none(resetTasksTable);
    await db.none(resetCommentsTable);
    await db.none(resetAttachmentsTable);
    await db.none(resetProjectMembersTable);
    await db.none(resetWorkgroupMembersTable);
}

exports.seedDataBaseTables = async () => {
    const seedUsersTable = fs.readFileSync(
        path.join(__dirname, '../scripts/seed/seed_users.sql')
    ).toString();

    const seedNotificationsTable = fs.readFileSync(
        path.join(__dirname, '../scripts/seed/seed_notifications.sql')
    ).toString();

    const seedProjectsTable = fs.readFileSync(
        path.join(__dirname, '../scripts/seed/seed_projects.sql')
    ).toString();

    const seedWorkgroupsTable = fs.readFileSync(
        path.join(__dirname, '../scripts/seed/seed_workgroups.sql')
    ).toString();

    const seedTasksTable = fs.readFileSync(
        path.join(__dirname, '../scripts/seed/seed_tasks.sql')
    ).toString();

    const seedCommentsTable = fs.readFileSync(
        path.join(__dirname, '../scripts/seed/seed_comments.sql')
    ).toString();

    const seedAttachmentsTable = fs.readFileSync(
        path.join(__dirname, '../scripts/seed/seed_attachments.sql')
    ).toString();

    const seedProjectMembersTable = fs.readFileSync(
        path.join(__dirname, '../scripts/seed/seed_projectMembers.sql')
    ).toString();

    const seedWorkgroupMembersTable = fs.readFileSync(
        path.join(__dirname, '../scripts/seed/seed_workgroupmembers.sql')
    ).toString();

    await db.none(seedUsersTable);
    await db.none(seedNotificationsTable);
    await db.none(seedProjectsTable);
    await db.none(seedWorkgroupsTable);
    await db.none(seedTasksTable);
    await db.none(seedCommentsTable);
    await db.none(seedAttachmentsTable);
    await db.none(seedProjectMembersTable);
    await db.none(seedWorkgroupMembersTable);
}

exports.validUserRegisterSchema = {
    username: 'johndoe10',
    email: 'johndoe@gmail.com',
    password: 'node1234'
}

exports.validUserCredentials = {
    email: "johndoe@gmail.com",
    password: "node1234"
}

exports.invalidtoken = 'sadadjsdnllasndnaowqrfjcnl';

exports.registerUser = async (userFixture) => {
    return request(app)
        .post('/api/v1.0/user/register')
        .send(userFixture)
}

exports.loginUser = async (userFixture) => {
    return request(app)
        .post('/api/v1.0/user/login')
        .send(userFixture)
}

exports.changeUserPermissions = async (userId, newRole) => {
    const sql = `UPDATE users SET role = '${newRole}' WHERE id = ${userId} RETURNING id, role`;

    return db.any(sql)
        .then(result => result)
        .catch(err => { 
            throw new Error(err);
        })
}

exports.createUserNotifications = async (userId) => {
    const sql = `INSERT INTO notifications (user_id, message, read) 
        VALUES (${userId}, 'You have been assigned a new task: Design Homepage', false) RETURNING *`;

    return db.any(sql)
        .then(result => result)
        .catch(err => { 
            throw new Error(err);
        })
}

exports.createUserComment = async (userId) => {
    const sql = `INSERT INTO comments (task_id, user_id, content) 
        VALUES (1, ${userId}, 'I have completed the initial design. Please review and provide feedback.') RETURNING *`;

    return db.any(sql)
        .then(result => result)
        .catch(err => { 
            throw new Error(err);
        })
}

exports.createUserAttachment = async (userId) => {
    const sql = `INSERT INTO attachments (task_id, filename, file_path, uploaded_by) 
        VALUES (1, 'api_documentation.pdf', '/uploads/api_documentation.pdf', ${userId}) RETURNING *`;

    return db.any(sql)
        .then(result => result)
        .catch(err => { 
            throw new Error(err);
        })
}

exports.createProjectMember = async (userId) => {
    const sql = `INSERT INTO projectmembers (project_id, user_id, role) 
        VALUES (1, ${userId}, 'team_member') RETURNING *`;

    return db.any(sql)
        .then(result => result)
        .catch(err => { 
            throw new Error(err);
        })
}

exports.createWorkGroupMember = async (userId) => {
    const sql = `INSERT INTO workgroupmembers (user_id, workgroup_id) VALUES (${userId}, 1);`

    return db.any(sql)
        .then(result => result)
        .catch(err => { 
            throw new Error(err);
        })
}

exports.createTask = async (userId) => {
    const sql = `INSERT INTO tasks (project_id, workgroup_id, title, description, status, assigned_to, due_date)
        VALUES (1, 2, 'API Integration', 'Integrate external API with the backend system.', 'in_progress', ${userId}, '2024-07-25')`;

    return db.any(sql)
        .then(result => result)
        .catch(err => {
            throw new Error(err);
        })
}