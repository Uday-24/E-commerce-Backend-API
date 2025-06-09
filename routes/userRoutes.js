const express = require('express');
const { forgotPassword, resetPassword } = require('../controllers/userController');
const { resetPasswordValidation } = require('../validators/resetPasswordValidation');
const { validateRequest } = require('../validators/validateErrors');
const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token',resetPasswordValidation, validateRequest, resetPassword);

module.exports = router;