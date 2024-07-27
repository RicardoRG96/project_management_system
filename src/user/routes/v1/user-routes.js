var express = require('express');
var router = express.Router();
const userHandler = require('../../user-handlers');

/** GET Methods */
/**
 * @openapi
 * '/api/v1.0/user/{userId}':
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
router.get('/:userId', userHandler.getOneUser);

module.exports = router;  