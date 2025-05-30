const express = require('express');
const { registerValidation, loginValidation } = require('../validators/authValidator');
const { validateRequest } = require('../validators/validateErrors');
const { register, login, refreshToken, logout } = require('../controllers/authController');
const { protected } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.get('/refresh-token', refreshToken);
router.post('/logout', protected, logout);

module.exports = router;