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
 *      - id: userId
 *        in: path
 *        description: The id of the user
 *        required: true
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.get('/:id', userHandler.getOneUser);

module.exports = router;  