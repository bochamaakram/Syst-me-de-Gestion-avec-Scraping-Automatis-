const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const googleAuthController = require('../controllers/googleAuthController');
const auth = require('../middleware/auth');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');

// Standard auth routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', auth, authController.getMe);

// Google OAuth routes
router.get('/google', googleAuthController.googleAuth);
router.get('/google/callback', googleAuthController.googleCallback);

module.exports = router;
