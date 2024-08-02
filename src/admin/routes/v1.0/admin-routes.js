var express = require('express');
var router = express.Router();
const adminHandler = require('../../admin-handlers');
const verifyToken = require('../../../auth/verify-token');
const hasPermissions = require('../../../auth/verify-role');
const ROLES = require('../../../auth/roles');

/** PATCH Methods */

router.patch('/users-management/change-permissions', 
    verifyToken, 
    hasPermissions([ROLES.ADMIN])
)

module.exports = router;