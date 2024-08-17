const tasksService = require('./tasks-service');
const { validationResult } = require('express-validator');
const { fileCompressor } = require('./attachments-management/attachment-handler');

exports.createTaskHandler = async (req, res, next) => {
    const task = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } 
        const createdTask = await tasksService.createTaskService(task, next);
        if (!createdTask) {
            return next();
        }
        return res.status(201).json(createdTask);
    }
    catch (err) {
        return next(err);
    }
}

exports.createCommentHandler = async (req, res, next) => {
    const comment = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const createdComment = await tasksService.createCommentService(comment, next);
        if (!createdComment) {
            return next();
        }
        return res.status(201).json(createdComment);
    }
    catch (err) {
        return next(err);
    }
}

exports.createAttachmentHandler = async (req, res, next) => {
    const taskId = req.params.taskId;
    const uploadedBy = req.params.userId;
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.'});
        }
        const filename = req.file.filename;
        const filePath = req.file.path;
        const attachment = {
            task_id: taskId,
            filename,
            file_path: filePath,
            uploaded_by: uploadedBy
        }
        const createdAttachment = await tasksService.createAttachmentService(attachment, next);
        fileCompressor(filePath,filename, next);
        if (!createdAttachment) {
            return next();
        }
        if (createdAttachment === 'not found') {
            return res.status(404).json({ message: 'userId or taskId not found.' });
        }
        return res.status(201).json({ message: 'Image uploaded successfully!', filePath });
    }
    catch (err) {
        return next(err);
    }
}