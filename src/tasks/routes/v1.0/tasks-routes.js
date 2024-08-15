var express = require('express');
var router = express.Router();
const tasksHandler = require('../../tasks-handler');
const validate = require('../../validation/validate-tasks-requests');
const verifyToken = require('../../../auth/verify-token');
const hasPermissions = require('../../../auth/verify-role');
const ROLES = require('../../../auth/roles');

/** POST Methods */

/**
 * @openapi
 * '/api/v1.0/tasks/create-task':
 *  post:
 *     tags:
 *     - Tasks Handlers
 *     summary: Create a new task
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - project_id
 *              - workgroup_id
 *              - title
 *              - description
 *              - status
 *              - assigned_to
 *              - due_date
 *            properties:
 *              project_id:
 *                type: number
 *                example: 10 
 *              workgroup_id:
 *                type: number
 *                example: 15
 *              title:
 *                type: string
 *                example: API Integration
 *              description:
 *                type: string
 *                example: Integrate the external API with the backend system.
 *              status:
 *                type: string
 *                example: in_progress
 *              assigned_to:
 *                type: string
 *                example: 23
 *              due_date:
 *                type: string
 *                example: 2024-08-21
 *     responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                     project_id:
 *                        type: number
 *                        example: 10 
 *                     workgroup_id:
 *                        type: number
 *                        example: 15
 *                     title:
 *                        type: string
 *                        example: API Integration
 *                     description:
 *                        type: string
 *                        example: Integrate the external API with the backend system.
 *                     status:
 *                        type: string
 *                        example: in_progress
 *                     assigned_to:
 *                        type: string
 *                        example: 23
 *                     due_date:
 *                        type: string
 *                        example: 2024-08-21
 *                     created_at:
 *                        type: string
 *                        example: "2024-07-27T21:04:10.938Z"
 *                     updated_at:
 *                        type: string
 *                        example: "2024-07-27T21:04:10.938Z"
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Server Error 
 */
router.post(
    '/create-task', 
    verifyToken,
    hasPermissions([ROLES.ADMIN, ROLES.PROJECT_MANAGER, ROLES.TECHNICAL_LEADER]),
    validate.validateCreateTaskRequest(), 
    tasksHandler.createTaskHandler
);

/**
 * @openapi
 * '/api/v1.0/tasks/create-comment':
 *  post:
 *     tags:
 *     - Tasks Handlers
 *     summary: Create a new comment
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - task_id
 *              - user_id
 *              - content
 *              - created_at
 *            properties:
 *              task_id:
 *                type: number
 *                example: 15 
 *              user_id:
 *                type: number
 *                example: 42
 *              content:
 *                type: string
 *                example: I have completed the initial design. Please review and provide feedback.
 *     responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                     id:
 *                        type: number
 *                        example: 100 
 *                     task_id:
 *                        type: number
 *                        example: 15
 *                     user_id:
 *                        type: number
 *                        example: 42
 *                     content:
 *                        type: string
 *                        example: I have completed the initial design. Please review and provide feedback.
 *                     created_at:
 *                        type: string
 *                        example: "2024-07-27T21:04:10.938Z"
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      500:
 *        description: Server Error 
 */
router.post(
    '/create-comment', 
    verifyToken,
    hasPermissions([ROLES.ADMIN, ROLES.PROJECT_MANAGER, ROLES.TECHNICAL_LEADER, ROLES.TEAM_MEMBER]),
    validate.validateCreateCommentRequest(), 
    tasksHandler.createCommentHandler
);

module.exports = router;