const { body } = require('express-validator');

exports.resetPasswordValidation = [
  body('newPassword')
    .trim()
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),

  body('confirmPassword')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Confirm password must be at least 6 characters')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];