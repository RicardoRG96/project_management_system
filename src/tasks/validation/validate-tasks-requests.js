const { body } = require('express-validator');

exports.validateCreateTaskRequest = () => {
    return [
        body('project_id').isInt().notEmpty().escape(),
        body('workgroup_id').isInt().notEmpty().escape(),
        body('title').notEmpty().escape(),
        body('description').notEmpty().escape(),
        body('status').notEmpty().escape(),
        body('assigned_to').isInt().notEmpty().escape(),
        body('due_date').notEmpty().escape()
    ];
}