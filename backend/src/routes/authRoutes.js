const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateUser = require('../middleware/auth');

// Notice: We just say '/register' instead of '/api/auth/register'
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected routes
router.put('/profile', authenticateUser, authController.updateProfile);
router.delete('/profile', authenticateUser, authController.deleteAccount);


module.exports = router;