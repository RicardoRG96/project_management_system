const { body } = require('express-validator');

const validateRegisterRequest = ()  => {
    return [
        body('username').notEmpty().trim().escape(),
        body('email').isEmail().escape().notEmpty(),
        body('password').isLength({ min: 8 }).escape()
    ]
}

const validateLoginRequest = () => {
    return [
        body('email').isEmail().notEmpty(),
        body('password').isLength({ min: 8 }).notEmpty().escape()
    ]
}

module.exports = {
    validateRegisterRequest,
    validateLoginRequest
}