const { db } = require('../db/config');
const app = require('../app');
const request = require('supertest');

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