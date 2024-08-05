var express = require('express');
var router = express.Router();
const userHandler = require('../../user-handlers');
const validate = require('../../validation/validate-user-requests');
const verifyToken = require('../../../auth/verify-token');
const hasPermissions = require('../../../auth/verify-role');
const ROLES = require('../../../auth/roles');

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
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get(
    '/:userId',
    verifyToken,
    hasPermissions([
        ROLES.ADMIN, 
        ROLES.PROJECT_MANAGER, 
        ROLES.TEAM_MEMBER, 
        ROLES.TECHNICAL_LEADER, 
        ROLES.GUEST_USER
    ]), 
    userHandler.getOneUserHandler
);

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
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */

router.get(
    '/:userId/notifications', 
    verifyToken, 
    hasPermissions([ROLES.ADMIN, 
        ROLES.PROJECT_MANAGER, 
        ROLES.TEAM_MEMBER, 
        ROLES.TECHNICAL_LEADER,
        ROLES.GUEST_USER
    ]), 
    userHandler.getAllUserNotificationsHandler
);

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
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get(
    '/:userId/notifications/:notificationId',
    verifyToken,
    hasPermissions([
        ROLES.ADMIN, 
        ROLES.PROJECT_MANAGER, 
        ROLES.TEAM_MEMBER, 
        ROLES.TECHNICAL_LEADER,
        ROLES.GUEST_USER
    ]), 
    userHandler.getOneNotificationHandler
);

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
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get(
    '/:userId/history/comments',
    verifyToken,
    hasPermissions([
        ROLES.ADMIN, 
        ROLES.PROJECT_MANAGER, 
        ROLES.TEAM_MEMBER, 
        ROLES.TECHNICAL_LEADER
    ]), 
    userHandler.getAllUserHistoryCommentsHandler
);

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
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get(
    '/:userId/history/comments/:commentId',
    verifyToken,
    hasPermissions([ROLES.ADMIN, ROLES.PROJECT_MANAGER, ROLES.TEAM_MEMBER, ROLES.TECHNICAL_LEADER]), 
    userHandler.getOneUserHistoryCommentHandler
);

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
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get(
    '/:userId/history/attachments',
    verifyToken,
    hasPermissions([ROLES.ADMIN, ROLES.PROJECT_MANAGER, ROLES.TEAM_MEMBER, ROLES.TECHNICAL_LEADER]),
    userHandler.getAllUserHistoryUploadedFilesHandler
);

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
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get(
    '/:userId/history/attachments/:attachmentId',
    verifyToken,
    hasPermissions([ROLES.ADMIN, ROLES.PROJECT_MANAGER, ROLES.TEAM_MEMBER, ROLES.TECHNICAL_LEADER]),
    userHandler.getOneUserHistoryUploadedfileHandler
);

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
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get(
    '/:userId/history/projects',
    verifyToken,
    hasPermissions([ROLES.ADMIN, ROLES.PROJECT_MANAGER, ROLES.TEAM_MEMBER, ROLES.TECHNICAL_LEADER]),
    userHandler.getAllUserHistoryProjectsHandler
);

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
 *                          example: 23
 *                       user_role:
 *                          type: string
 *                          example: team_member
 *                       user_incorporation_date:
 *                          type: string
 *                          example: 2024-07-25T23:45:55.006Z     
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get(
    '/:userId/history/projects/:projectId',
    verifyToken,
    hasPermissions([ROLES.ADMIN, ROLES.PROJECT_MANAGER, ROLES.TEAM_MEMBER, ROLES.TECHNICAL_LEADER]),
    userHandler.getOneUserHistoryProjectHandler
);

/**
 * @openapi
 * /api/v1.0/user/{userId}/history/workgroups:
 *  get:
 *     tags:
 *     - User Handlers
 *     summary: Get all workgroups that the user has participated in
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
 *                       workgroup_id:
 *                          type: number
 *                          example: 10
 *                       project_id:
 *                          type: number
 *                          example: 5
 *                       workgroup_name: 
 *                          type: string
 *                          example: Backend Team.
 *                       technical_lead_id:
 *                          type: number
 *                          example: 5
 *                       workgroup_creation_date:
 *                          type: string
 *                          example: 2024-07-25T23:45:55.006Z
 *                       user_id:
 *                          type: number
 *                          example: 23  
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get(
    '/:userId/history/workgroups',
    verifyToken,
    hasPermissions([ROLES.ADMIN, ROLES.PROJECT_MANAGER, ROLES.TEAM_MEMBER, ROLES.TECHNICAL_LEADER]),
    userHandler.getAllUserHistoryWorkgroupsHandler
);

/**
 * @openapi
 * /api/v1.0/user/{userId}/history/workgroups/{workgroupId}:
 *  get:
 *     tags:
 *     - User Handlers
 *     summary: Get a specific workgroup that the user has participated in
 *     parameters:
 *      - name: userId
 *        in: path
 *        description: The id of the user
 *        required: true
 *      - name: workgroupId
 *        in: path
 *        description: The id of the workgroup
 *        required: true
 *     responses:
 *      200:    
 *        description: OK
 *        content:
 *           application/json:
 *               schema:
 *                   type: object
 *                   properties: 
 *                       workgroup_id:
 *                          type: number
 *                          example: 10
 *                       project_id:
 *                          type: number
 *                          example: 5
 *                       workgroup_name: 
 *                          type: string
 *                          example: Backend Team.
 *                       technical_lead_id:
 *                          type: number
 *                          example: 5
 *                       workgroup_creation_date:
 *                          type: string
 *                          example: 2024-07-25T23:45:55.006Z
 *                       user_id:
 *                          type: number
 *                          example: 23  
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get(
    '/:userId/history/workgroups/:workgroupId',
    verifyToken,
    hasPermissions([ROLES.ADMIN, ROLES.PROJECT_MANAGER, ROLES.TEAM_MEMBER, ROLES.TECHNICAL_LEADER]),
    userHandler.getOneUserHistoryWorkgroupHandler
);

/** POST Methods */

/**
 * @openapi
 * '/api/v1.0/user/register':
 *  post:
 *     tags:
 *     - User Handlers
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
 *                example: pass12345
 *     responses:
 *      201:
 *        description: Created
 *        content:
 *          application/json:
 *             schema:
 *                properties:
 *                  username:
 *                      type: string
 *                      example: johndoe 
 *                  email:
 *                      type: string
 *                      example: johndoe@mail.com
 *                  role:
 *                      type: string
 *                      example: admin
 *      400:
 *        description: Bad request
 *      409:
 *        description: Conflict
 */
router.post(
    '/register', 
    validate.validateRegisterRequest(), 
    userHandler.registerUserHandler
);

/**
 * @openapi
 * '/api/v1.0/user/login':
 *  post:
 *     tags:
 *     - User Handlers
 *     summary: Login a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *                example: example@mail.com 
 *              password:
 *                type: string
 *                example: pass.1234
 *     responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *             schema:
 *                properties:
 *                  user_id:
 *                      type: number
 *                      example: 545 
 *                  username:
 *                      type: string
 *                      example: johndoe@mail.com
 *                  token:
 *                      type: string
 *                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.5YfjsEsNqssar3r
 *      400:
 *        description: Bad request
 *      401:
 *        description: Unauthorized
 */
router.post(
    '/login', 
    validate.validateLoginRequest(), 
    userHandler.loginUserHandler
);

module.exports = router;