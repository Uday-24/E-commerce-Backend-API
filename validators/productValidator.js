const { body } = require('express-validator');

exports.productValidation = [
    body('name').notEmpty().withMessage('Product name is required'),
    body('description').notEmpty().withMessage('Product description is required'),
    body('price').isInt({min: 0}).withMessage('Product price must be greater than 0'),
    body('category').notEmpty().withMessage('Product category is required'),
    body('imageurl').notEmpty().withMessage('Product image is required'),
    body('stock').isInt({ min: 0 }).withMessage('Product stock must be greater than 0'),
]