const { body } = require('express-validator');

exports.validateRegisterRequest = ()  => {
    return [
        body('username').notEmpty().trim().escape(),
        body('email').isEmail().escape().notEmpty(),
        body('password').isLength({ min: 8 }).escape()
    ]
}

exports.validateLoginRequest = () => {
    return [
        body('email').isEmail().notEmpty(),
        body('password').isLength({ min: 8 }).notEmpty().escape()
    ]
}

exports.validateEmailUpdateRequest = () => {
    return [
        body('userId').isInt().escape().notEmpty(),
        body('email').isEmail().escape().notEmpty()
    ]
}