var express = require('express');
var router = express.Router();

/** GET Methods */
/**
 * @openapi
 * '/user/':
 *  get:
 *     tags:
 *     - Users
 *     summary: Get a user by username
 *     parameters:
 *      - name: username
 *        in: path
 *        description: The username of the user
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

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
