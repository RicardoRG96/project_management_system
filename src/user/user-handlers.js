const { validationResult } = require('express-validator');
const userService = require('./user-service');

exports.getOneUserHandler = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const user = await userService.getUserByIdService(userId, next);
        if (!user.length) {
            return res.sendStatus(404);
        } 
        return res.status(200).json(user);
    }   
    catch (err) {
        return next(err);
    }
}

exports.getAllUserNotificationsHandler = async (req, res ,next) => {
    const userId = req.params.userId;
    try {
        const notifications = await userService.getAllUserNotificationsService(userId, next);
        if (!notifications.length) {
            return res.sendStatus(404);
        }
        return res.status(200).json(notifications);
    }
    catch (err) {
        return next(err);
    }
}

exports.getOneNotificationHandler = async (req, res, next) => {
    const { userId, notificationId } = req.params;
    try {
        const notification = await userService.getOneNotificationService(userId, notificationId, next);
        if (!notification.length) {
            return res.sendStatus(404);
        }
        return res.status(200).json(notification);
    }
    catch (err) {
        return next(err);
    }
}

exports.getAllUserHistoryCommentsHandler = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const comments = await userService.getAllUserHistoryCommentsService(userId, next);
        if (!comments.length) {
            return res.sendStatus(404);
        }
        return res.status(200).json(comments);
    }
    catch (err) {
        return next(err);
    }
}

exports.getOneUserHistoryCommentHandler = async (req, res, next) => {
    const { userId, commentId } = req.params;
    try {
        const comment = await userService.getOneUserHistoryCommentService(userId, commentId, next);
        if (!comment.length) {
            return res.sendStatus(404);
        }
        return res.status(200).json(comment);
    }
    catch (err) {
        return next(err);
    }
}

exports.getAllUserHistoryUploadedFilesHandler = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const files = await userService.getAllUserHistoryUploadedFilesService(userId, next);
        if (!files.length) {
            return res.sendStatus(404);
        }   
        return res.status(200).json(files);
    }
    catch (err) {
        return next(err);
    }
}

exports.getOneUserHistoryUploadedfileHandler = async (req, res, next) => {
    const { userId, attachmentId } = req.params;
    try {
        const file = await userService.getOneUserHistoryUploadedfileService(userId, attachmentId);
        if (!file.length) {
            return res.sendStatus(404);
        }
        return res.status(200).json(file);
    }
    catch (err) {
        return next(err);
    }
}

exports.getAllUserHistoryProjectsHandler = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const projects = await userService.getAllUserHistoryProjectsService(userId, next);
        if (!projects.length) {
            return res.sendStatus(404);
        }
        return res.status(200).json(projects);
    }
    catch (err) {
        return next(err);
    }
}

exports.getOneUserHistoryProjectHandler = async (req, res, next) => {
    const { userId, projectId } = req.params;
    try {
        const project = await userService.getOneUserHistoryProjectService(userId, projectId, next);
        if (!project.length) {
            return res.sendStatus(404);
        }
        return res.status(200).json(project);
    }
    catch (err) {
        return next(err);
    }
}

exports.getAllUserHistoryWorkgroupsHandler = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const workgroups = await userService.getAllUserHistoryWorkgroupsService(userId, next);
        if (!workgroups.length) {
            return res.sendStatus(404)
        }
        return res.status(200).json(workgroups)
    }
    catch (err) {
        return next(err);
    }
}

exports.getOneUserHistoryWorkgroupHandler = async (req, res, next) => {
    const { userId, workgroupId } = req.params;
    try {
        const workgroup = await userService.getOneUserHistoryWorkgroupService(userId, workgroupId, next);
        if (!workgroup.length) {
            return res.sendStatus(404);
        }
        return res.status(200).json(workgroup);
    }
    catch (err) {
        return next(err);
    }
}

exports.getAllUserHistoryTasksHandler = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const tasks = await userService.getAllUserHistoryTasksService(userId, next);
        if (!tasks.length) {
            return res.sendStatus(404);
        }
        return res.status(200).json(tasks);
    }
    catch (err) {
        return next(err);
    }
}

exports.getOneUserHistoryTaskHandler = async (req, res, next) => {
    const { userId, taskId } = req.params;
    try {
        const task = await userService.getOneUserHistoryTaskService(userId,taskId, next);
        if (!task.length) {
            return res.sendStatus(404);
        }
        return res.status(200).json(task);
    }
    catch (err) {
        return next(err);
    }
}

exports.getAllUserCurrentlyAssignedTasksHandler = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const currentlyAssignedTasks = await userService.getAllUserCurrentlyAssignedTasksService(userId, next);
        if (!currentlyAssignedTasks.length) {
            return res.sendStatus(404);
        }
        return res.status(200).json(currentlyAssignedTasks);
    }
    catch (err) {
        return next(err);
    }
}

exports.getOneUserCurrentlyAssignedTaskHandler = async (req, res, next) => {
    const { userId, taskId } = req.params;
    try {
        const currentlyAssignedTask = await userService.getOneUserCurrentlyAssignedTaskService(userId, taskId, next);
        if (!currentlyAssignedTask.length) {
            return res.sendStatus(404);
        }
        return res.status(200).json(currentlyAssignedTask);
    }
    catch (err) {
        return next(err);
    }
}

exports.registerUserHandler = async (req, res, next) => {
    const userSchema = req.body;
    const { username, email } = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const validateIfUserExists = await userService.findUserService(username, email, next);
        if (validateIfUserExists) {
            return res.sendStatus(409);
        }
        const registerUser = await userService.registerUserService(userSchema, next);
        return res.status(201).json(registerUser);
    }
    catch (err) {
        return next(err);
    }
}

exports.loginUserHandler = async (req, res, next) => {
    const sentUserCredentials = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const loginUser = await userService.loginUserService(sentUserCredentials, next);
        if (!loginUser) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        return res.status(200).json(loginUser);
    }
    catch (err) {
        return next(err);
    }
}

exports.updateUserEmailHandler = async (req, res, next) => {
    const { userId, email } = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const updatedEmail = await userService.updateUserEmailService(userId, email, next);
        if (!updatedEmail.length) {
            return res.sendStatus(304);
        }
        return res.sendStatus(204);
    }
    catch (err) {
        return next(err);
    }
}

exports.updateUserPasswordHandler = async (req, res, next) => {
    const userData = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const updatedPassword = await userService.updateUserPasswordService(userData, next);
        if (updatedPassword === null) {
            return res.status(404).json({ message: 'Username does not exist' });
        }
        if (!updatedPassword.length) {
            return res.sendStatus(304);
        }
        return res.sendStatus(204);
    }
    catch (err) {
        return next(err);
    }
}