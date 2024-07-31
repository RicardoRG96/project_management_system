var express = require('express');
var router = express.Router();
const userHandler = require('../../user-handlers');
const validate = require('../../validation/validate-register-user-request');

/** GET Methods */

/**
 * @openapi
 * /api/v1.0/user/{userId}:
 *  get:
 *     tags:
 *     - User Handlers
 *     summary: Get a user by userId
 *     parameters:
 *      - name: userId
 *        in: path
 *        description: The id of the user
 *        required: true
 *     responses:
 *      200:    
 *        description: OK
 *        content:
 *           application/json:
 *               schema:
 *                   type: object
 *                   properties: 
 *                       id:
 *                          type: number
 *                          example: 221
 *                       username: 
 *                          type: string
 *                          example: John Doe
 *                       email:
 *                          type: string
 *                          example: johndoe@gmail.com
 *                       password:
 *                          type: string
 *                          example: ahfnksadnfa5413asd411asd
 *                       role:
 *                          type: string
 *                          example: admin
 *                       created_at:
 *                          type: string
 *                          example: 2024-07-25T23:45:55.006Z     
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get('/:userId', userHandler.getOneUserHandler);

/**
 * @openapi
 * /api/v1.0/user/{userId}/notifications:
 *  get:
 *     tags:
 *     - User Handlers
 *     summary: Get all user notifications
 *     parameters:
 *      - name: userId
 *        in: path
 *        description: The id of the user
 *        required: true
 *     responses:
 *      200:    
 *        description: OK
 *        content:
 *           application/json:
 *               schema:
 *                   type: object
 *                   properties: 
 *                       id:
 *                          type: number
 *                          example: 50
 *                       user_id: 
 *                          type: number
 *                          example: 221
 *                       message:
 *                          type: string
 *                          example: You have been assigned a new task. Design Homepage
 *                       read:
 *                          type: boolean
 *                          example: false
 *                       created_at:
 *                          type: string
 *                          example: 2024-07-25T23:45:55.006Z     
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */

router.get('/:userId/notifications', userHandler.getAllUserNotificationsHandler);

/**
 * @openapi
 * /api/v1.0/user/{userId}/notifications/{notificationId}:
 *  get:
 *     tags:
 *     - User Handlers
 *     summary: Get a specific user notification
 *     parameters:
 *      - name: userId
 *        in: path
 *        description: The id of the user
 *        required: true
 *      - name: notificationId
 *        in: path
 *        description: The id of the notification
 *        required: true    
 *     responses:
 *      200:    
 *        description: OK
 *        content:
 *           application/json:
 *               schema:
 *                   type: object
 *                   properties: 
 *                       id:
 *                          type: number
 *                          example: 50
 *                       user_id: 
 *                          type: number
 *                          example: 221
 *                       message:
 *                          type: string
 *                          example: You have been assigned a new task. Design Homepage
 *                       read:
 *                          type: boolean
 *                          example: false
 *                       created_at:
 *                          type: string
 *                          example: 2024-07-25T23:45:55.006Z     
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get('/:userId/notifications/:notificationId', userHandler.getOneNotificationHandler);

/**
 * @openapi
 * /api/v1.0/user/{userId}/history/comments:
 *  get:
 *     tags:
 *     - User Handlers
 *     summary: Get all user history comments
 *     parameters:
 *      - name: userId
 *        in: path
 *        description: The id of the user
 *        required: true
 *     responses:
 *      200:    
 *        description: OK
 *        content:
 *           application/json:
 *               schema:
 *                   type: object
 *                   properties: 
 *                       id:
 *                          type: number
 *                          example: 50
 *                       task_id:
 *                          type: number
 *                          example: 25
 *                       user_id: 
 *                          type: number
 *                          example: 221
 *                       content:
 *                          type: string
 *                          example: You have been assigned a new task. Design Homepage
 *                       created_at:
 *                          type: string
 *                          example: 2024-07-25T23:45:55.006Z     
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get('/:userId/history/comments', userHandler.getAllUserHistoryCommentsHandler);

/**
 * @openapi
 * /api/v1.0/user/{userId}/history/comments/{commentId}:
 *  get:
 *     tags:
 *     - User Handlers
 *     summary: Get a specific comment made by a user
 *     parameters:
 *      - name: userId
 *        in: path
 *        description: The id of the user
 *        required: true
 *      - name: commentId
 *        in: path
 *        description: The id of the comment
 *        required: true
 *     responses:
 *      200:    
 *        description: OK
 *        content:
 *           application/json:
 *               schema:
 *                   type: object
 *                   properties: 
 *                       id:
 *                          type: number
 *                          example: 50
 *                       task_id:
 *                          type: number
 *                          example: 25
 *                       user_id: 
 *                          type: number
 *                          example: 221
 *                       content:
 *                          type: string
 *                          example: You have been assigned a new task. Design Homepage
 *                       created_at:
 *                          type: string
 *                          example: 2024-07-25T23:45:55.006Z     
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get('/:userId/history/comments/:commentId', userHandler.getOneUserHistoryCommentHandler);

/**
 * @openapi
 * /api/v1.0/user/{userId}/history/attachments:
 *  get:
 *     tags:
 *     - User Handlers
 *     summary: Get all user history uploaded files
 *     parameters:
 *      - name: userId
 *        in: path
 *        description: The id of the user
 *        required: true
 *     responses:
 *      200:    
 *        description: OK
 *        content:
 *           application/json:
 *               schema:
 *                   type: object
 *                   properties: 
 *                       id:
 *                          type: number
 *                          example: 50
 *                       task_id:
 *                          type: number
 *                          example: 25
 *                       filename: 
 *                          type: string
 *                          example: homepage_design_mockup.png
 *                       file_path:
 *                          type: string
 *                          example: /uploads/homepage_design_mockup.png
 *                       uploaded_by:
 *                          type: number
 *                          example: 23
 *                       uploaded_at:
 *                          type: string
 *                          example: 2024-07-25T23:45:55.006Z     
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get('/:userId/history/attachments', userHandler.getAllUserHistoryUploadedFilesHandler);

/**
 * @openapi
 * /api/v1.0/user/{userId}/history/attachments/{attachmentId}:
 *  get:
 *     tags:
 *     - User Handlers
 *     summary: Get a specific file uploaded by a user
 *     parameters:
 *      - name: userId
 *        in: path
 *        description: The id of the user
 *        required: true
 *      - name: attachmentId
 *        in: path
 *        description: The id of the attachment file uploaded
 *        required: true
 *     responses:
 *      200:    
 *        description: OK
 *        content:
 *           application/json:
 *               schema:
 *                   type: object
 *                   properties: 
 *                       id:
 *                          type: number
 *                          example: 50
 *                       task_id:
 *                          type: number
 *                          example: 25
 *                       filename: 
 *                          type: string
 *                          example: homepage_design_mockup.png
 *                       file_path:
 *                          type: string
 *                          example: /uploads/homepage_design_mockup.png
 *                       uploaded_by:
 *                          type: number
 *                          example: 23
 *                       uploaded_at:
 *                          type: string
 *                          example: 2024-07-25T23:45:55.006Z    
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get('/:userId/history/attachments/:attachmentId', userHandler.getOneUserHistoryUploadedfileHandler);

/**
 * @openapi
 * /api/v1.0/user/{userId}/history/projects:
 *  get:
 *     tags:
 *     - User Handlers
 *     summary: Get all the projects that the user has participated in
 *     parameters:
 *      - name: userId
 *        in: path
 *        description: The id of the user
 *        required: true
 *     responses:
 *      200:    
 *        description: OK
 *        content:
 *           application/json:
 *               schema:
 *                   type: object
 *                   properties: 
 *                       project_id:
 *                          type: number
 *                          example: 10
 *                       project_name:
 *                          type: string
 *                          example: Website Redesign
 *                       project_description: 
 *                          type: string
 *                          example: Complete redesign of the company website.
 *                       project_manager_id:
 *                          type: number
 *                          example: 5
 *                       project_manager_name:
 *                          type: string
 *                          example: adminUser
 *                       project_creation_date:
 *                          type: string
 *                          example: 2024-07-25T23:45:55.006Z
 *                       user_id:
 *                          type: number
 *                          example: 2024-07-25T23:45:55.006Z
 *                       user_role:
 *                          type: string
 *                          example: team_member
 *                       user_incorporation_date:
 *                          type: string
 *                          example: 2024-07-25T23:45:55.006Z     
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get('/:userId/history/projects', userHandler.getAllUserHistoryProjectsHandler);

/**
 * @openapi
 * /api/v1.0/user/{userId}/history/projects/{projectId}:
 *  get:
 *     tags:
 *     - User Handlers
 *     summary: Get a specific project that the user has participated in
 *     parameters:
 *      - name: userId
 *        in: path
 *        description: The id of the user
 *        required: true
 *      - name: projectId
 *        in: path
 *        description: The id of the project
 *        required: true
 *     responses:
 *      200:    
 *        description: OK
 *        content:
 *           application/json:
 *               schema:
 *                   type: object
 *                   properties: 
 *                       project_id:
 *                          type: number
 *                          example: 10
 *                       project_name:
 *                          type: string
 *                          example: Website Redesign
 *                       project_description: 
 *                          type: string
 *                          example: Complete redesign of the company website.
 *                       project_manager_id:
 *                          type: number
 *                          example: 5
 *                       project_manager_name:
 *                          type: string
 *                          example: adminUser
 *                       project_creation_date:
 *                          type: string
 *                          example: 2024-07-25T23:45:55.006Z
 *                       user_id:
 *                          type: number
 *                          example: 2024-07-25T23:45:55.006Z
 *                       user_role:
 *                          type: string
 *                          example: team_member
 *                       user_incorporation_date:
 *                          type: string
 *                          example: 2024-07-25T23:45:55.006Z     
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get('/:userId/history/projects/:projectId', userHandler.getOneUserHistoryProjectHandler);

/** POST Methods */

/**
 * @openapi
 * '/api/v1.0/user/register':
 *  post:
 *     tags:
 *     - User Handler
 *     summary: Create a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - username
 *              - email
 *              - password
 *              - role
 *            properties:
 *              username:
 *                type: string
 *                example: johndoe 
 *              email:
 *                type: string
 *                example: johndoe@mail.com
 *              password:
 *                type: string
 *                example: $2b$10$NG/lSTS/DdfBgGbf8pRAxeIfwZArlV3iLEMrCD6CPIAUOjhhq.iCS
 *              role:
 *                type: string
 *                example: admin
 *     responses:
 *      201:
 *        description: Created
 *      400:
 *        description: Bad request
 *      409:
 *        description: Conflict
 *      500:
 *        description: Server Error
 */
router.post(
    '/register', 
    validate.validateRegisterRequest(), 
    userHandler.registerUserHandler
);

module.exports = router;