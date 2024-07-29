var express = require('express');
var router = express.Router();
const userHandler = require('../../user-handlers');

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
 *     summary: Get all user notifications
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

module.exports = router;  