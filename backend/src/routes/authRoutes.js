const express = require('express');
const { registerUser, loginUser, getProfile } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', protect, adminOnly, registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getProfile);

module.exports = router;

