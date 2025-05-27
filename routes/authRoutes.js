const express = require('express');
const { register, login, refreshToken, logout } = require('../controllers/authController');
const { registerValidation, validateRequest, loginValidation } = require('../validators/authValidator');
const router = express.Router();

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.post('/logout', logout);
router.get('/refresh-token', refreshToken);

module.exports = router;