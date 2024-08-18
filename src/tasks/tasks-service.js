const taskRepository = require('./tasks-repository');
const { sendInAppNotification } = require('../notifications/send-notifications');
const eventEmitter = require('../../scheduled-jobs/events');

exports.createTaskService = async (task, next) => {
    const userId = task.assigned_to;
    const taskTitle = task.title;
    const assignedTaskMessage = `You have been assigned a new task: "${taskTitle}"`;
    try {
        const createdTask = await taskRepository.createTaskQuery(task, next);
        const user = await taskRepository.getUserById(userId, next);
        await sendInAppNotification(userId, assignedTaskMessage, next);
        const emailDetails = {
            username: user[0].username,
            title: taskTitle,
            due_date: task.due_date
        }
        eventEmitter.emit('assignedTask', emailDetails);
        return createdTask;
    }
    catch (err) {
        return next(err);
    }
}

exports.createCommentService = async (comment, next) => {
    const userId = comment.user_id;
    const taskId = comment.task_id;
    try {
        const task = await taskRepository.getTaskById(taskId, next);
        const user = await taskRepository.getUserById(userId, next);
        const taskTitle = task[0].title;
        const username = user[0].username;
        const taskOwner = task[0].assigned_to.toString();
        const commentAddedToTaskMessage = `${username} added a comment to the task ${taskTitle}`;

        const createdComment = await taskRepository.createCommentQuery(comment, next);
        await sendInAppNotification(taskOwner, commentAddedToTaskMessage, next);
        return createdComment;
    }
    catch (err) {
        return next(err);
    }
}

exports.createAttachmentService = async (attachment, next) => {
    const taskId = attachment.task_id;
    const userUploaderId = attachment.uploaded_by;
    try {
        const taskDetails = await taskRepository.getTaskById(taskId, next);
        const userUploader = await taskRepository.getUserById(userUploaderId, next);
        if (!taskDetails.length || !userUploader.length) {
            return 'not found';
        }
        const taskOwnerId = taskDetails[0].assigned_to.toString();
        const userUploaderName = userUploader[0].username;
        const attachmentFileMessage = `${userUploaderName} has uploaded a file to your task`;

        const createdAttachment = await taskRepository.createAttachmentQuery(attachment, next);
        await sendInAppNotification(taskOwnerId, attachmentFileMessage, next);
        return createdAttachment;
    }
    catch (err) {
        return next(err);
    }
}