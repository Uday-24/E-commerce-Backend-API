const { check, validationResult } = require('express-validator');

exports.registerValidation = [
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
]

exports.loginValidation = [
    check('email').isEmail().withMessage('Invalid email address'),
    check('password').isLength({min: 6}).withMessage('Password must have atleat 6 chars')
]

exports.validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(422);
        throw new Error(errors.array()[0].msg);
    }
    next();
}