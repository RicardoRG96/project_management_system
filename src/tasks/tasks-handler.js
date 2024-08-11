const tasksService = require('./tasks-sevice');
const { validationResult } = require('express-validator');

exports.createTaskHandler = async (req, res, next) => {
    const task = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            const createdTask = await tasksService.createTaskService(task, next);
            return res.status(201).json(createdTask);
        }
    }
    catch (err) {
        return next(err);
    }
}