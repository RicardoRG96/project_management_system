const taskRepository = require('./tasks-repository');
const { sendInAppNotification } = require('../notifications/send-notifications');

exports.createTaskService = async (task, next) => {
    const userId = task.assigned_to;
    const taskTitle = task.title;
    const assignedTaskMessage = `You have been assigned a new task: "${taskTitle}"`;
    try {
        const createdTask = await taskRepository.createTaskQuery(task, next);
        await sendInAppNotification(userId, assignedTaskMessage, next);
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