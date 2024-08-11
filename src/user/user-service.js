require('dotenv');
const jwt = require('jsonwebtoken');
const userRepository = require('./user-repository');
const passwordHandler = require('./password-handlers/hash-password-handler');
const SECRET_KEY = process.env.JWT_PASSWORD;

exports.getUserByIdService = async (userId, next) => {
    try {
        const user = await userRepository.getUserByIdQuery(userId, next);
        return user;
    }
    catch (err) {
        return next(err);
    }   
}

exports.getAllUserNotificationsService = async (userId, next) => {
    try {
        const notifications = await userRepository.getAllUserNotificationsQuery(userId, next);
        return notifications;
    }
    catch (err) {
        return next(err);
    }
}

exports.getOneNotificationService = async (userId, notificationId, next) => {
    try {
        const notification = await userRepository.getOneNotificationQuery(userId, notificationId, next);
        return notification;
    }
    catch (err) {
        return next(err);
    }
}

exports.getAllUserHistoryCommentsService = async (userId, next) => {
    try {
        const comments = await userRepository.getAllUserHistoryCommentsQuery(userId, next);
        return comments;
    }
    catch (err) {
        return next(err);
    }
}

exports.getOneUserHistoryCommentService = async (userId, commentId, next) => {
    try {
        const comment = await userRepository.getOneUserHistoryCommentQuery(userId, commentId, next);
        return comment;
    }
    catch (err) {
        return next(err);
    }
}

exports.getAllUserHistoryUploadedFilesService = async (userId, next) => {
    try {
        const files = await userRepository.getAllUserHistoryUploadedFilesQuery(userId, next);
        return files;
    }
    catch (err) {
        return next(err);
    }
}

exports.getOneUserHistoryUploadedfileService = async (userId, attachmentId, next) => {
    try {
        const file = await userRepository.getOneUserHistoryUploadedfileQuery(userId, attachmentId, next);
        return file;
    }
    catch (err) {
        return next(err);
    }
}

exports.getAllUserHistoryProjectsService = async (userId, next) => {
    try {
        const projects = await userRepository.getAllUserHistoryProjectsQuery(userId, next);
        return projects;
    }
    catch (err) {
        return next(err);
    }
}

exports.getOneUserHistoryProjectService = async (userId, projectId, next) => {
    try {
        const project = await userRepository.getOneUserHistoryProjectQuery(userId, projectId, next);
        return project;
    }
    catch (err) {
        return next(err);
    }
}

exports.getAllUserHistoryWorkgroupsService = async (userId, next) => {
    try {
        const workgroups = await userRepository.getAllUserHistoryWorkgroupsQuery(userId, next);
        return workgroups;
    }
    catch (err) {
        return next(err);
    }
}

exports.getOneUserHistoryWorkgroupService = async (userId, workgroupId, next) => {
    try {
        const workgroup = await userRepository.getOneUserHistoryWorkgroupQuery(userId, workgroupId, next);
        return workgroup;
    }
    catch (err) {
        return next(err);
    }
}

exports.getAllUserHistoryTasksService = async (userId, next) => {
    try {
        const tasks = await userRepository.getAllUserHistoryTasksQuery(userId, next);
        return tasks;
    }
    catch (err) {
        return next(err);
    }
}

exports.getOneUserHistoryTaskService = async (userId, taskId, next) => {
    try {
        const task = await userRepository.getOneUserHistoryTasksQuery(userId, taskId, next);
        return task;
    }
    catch (err) {
        return next(err);
    }
}

exports.getAllUserCurrentlyAssignedTasksService = async (userId, next) => {
    try {
        const currentlyAssignedTasks = await userRepository.getAllUserCurrentlyAssignedTasksQuery(userId, next);
        return currentlyAssignedTasks;
    }
    catch (err) {
        return next(err);
    }
}

exports.getOneUserCurrentlyAssignedTaskService = async (userId, taskId, next) => {
    try {
        const currentlyAssignedTask = await userRepository.getOneUserCurrentlyAssignedTaskQuery(userId, taskId, next);
        return currentlyAssignedTask;
    }
    catch (err) {
        return next(err);
    }
}

exports.registerUserService = async (userSchema, next) => {
    const { username, email, password } = userSchema;
    try {
        const hashedPassword = await passwordHandler.hashPassword(password, next);
        const userCredentialsWithHashedPassword = {
            username,
            email,
            password: hashedPassword
        }
        const user = await userRepository.registerUserQuery(userCredentialsWithHashedPassword, next);
        return user;
    }
    catch (err) {
        return next(err);
    }
}

exports.loginUserService = async (sentUserCredentials, next) => {
    const { email } = sentUserCredentials;
    try {
        const storedUser = await userRepository.findUserQuery('', email, next);
        if (!storedUser.length) {
            return null;
        }
        const token = await this.createToken(sentUserCredentials, storedUser, next);
        if (token) {
            return [
                {
                    user_id: storedUser[0].id,
                    username: storedUser[0].username,
                    token: token
                }
            ]
        }
        return null;
    }
    catch (err) {
        return next(err);
    }
}

exports.findUserService = async (userName, email, next) => {
    try {
        const user = await userRepository.findUserQuery(userName, email, next);
        if (user.length) {
            return true
        }
        return false;
    }
    catch (err) {
        return next(err);
    }
}

exports.createToken = async (sentUserCredentials, storedUserCredentials, next) => {
    const storedEmail = storedUserCredentials[0].email;
    const storedPassword = storedUserCredentials[0].password;
    const sentEmail = sentUserCredentials.email;
    const sentPassword = sentUserCredentials.password;
    const userRole = storedUserCredentials[0].role;
    try {
        const passwordValidation = await passwordHandler.compareSentPasswordWithPasswordStoredInDB(
            sentPassword, 
            storedPassword,
            next
        );
        if (sentEmail === storedEmail && passwordValidation) {
            const token = jwt.sign({ sentEmail, role: userRole }, SECRET_KEY, { expiresIn: '3h' });
            return token;
        }
        return null;
    }
    catch (err) {
        return next(err);
    }
}

exports.updateUserEmailService = async (userId, newEmail, next) => {
    try {
        const updatedEmail = await userRepository.updateUserEmailQuery(userId, newEmail, next);
        return updatedEmail;
    }
    catch (err) {
        return next(err);
    }
}

exports.updateUserPasswordService = async (userData, next) => {
    const { username, currentPassword, newPassword } =  userData;
    try {
        const storedUserCredentials = await userRepository.findUserQuery(username, '', next);
        if (!storedUserCredentials.length) {
            return null;
        }
        const storedPassword = storedUserCredentials[0].password;
        const passwordValidation = await passwordHandler.compareSentPasswordWithPasswordStoredInDB(
            currentPassword,
            storedPassword
        );
        if (!passwordValidation) {
            return [];
        }
        const hashNewPassword = await passwordHandler.hashPassword(newPassword, next);
        const updatedPassword = await userRepository.updateUserPasswordQuery(username, hashNewPassword, next);
        return updatedPassword;
    }
    catch (err) {
        return next(err);
    }
}