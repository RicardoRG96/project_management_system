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