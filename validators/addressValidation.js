const { body } = require('express-validator');

exports.addressValidation = [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('phone').trim().isInt().withMessage('Phone number is required'),
    body('street').trim().notEmpty().withMessage('Street is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('postalCode').trim().isInt().withMessage('Zip/Postal code is required'),
    body('country').trim().notEmpty().withMessage('Country is required'),
]