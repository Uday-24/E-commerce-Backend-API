const { body } = require('express-validator');

exports.registerValidation = [
    body('name').isLength({min: 3}).withMessage('Name must have 3 characters'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min: 6}).withMessage('Password must have 6 characters')
]

exports.loginValidation = [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({min: 6}).withMessage('Password must have 6 characters')
]