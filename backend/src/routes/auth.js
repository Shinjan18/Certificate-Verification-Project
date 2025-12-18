const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../middleware/auth');
const apiResponse = require('../config/apiResponse');
const { catchAsync, logMessage } = require('../middleware/errorHandler');

const router = express.Router();

// POST /api/auth/login
// Return JWT
router.post('/login', catchAsync(async (req, res) => {
  const { email, password } = req.body;
  
  // Log login attempt
  logMessage('auth', 'Login attempt', { email });
  
  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    logMessage('auth', 'Login failed - User not found', { email });
    return res.status(401).json(apiResponse.unauthorized('Invalid credentials'));
  }
  
  // Check password
  const isValidPassword = await user.matchPassword(password);
  if (!isValidPassword) {
    logMessage('auth', 'Login failed - Invalid password', { email });
    return res.status(401).json(apiResponse.unauthorized('Invalid credentials'));
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  logMessage('auth', 'Login successful', { email, userId: user._id });
  res.json(apiResponse.success({ token, user: { email: user.email, role: user.role } }, 'Login successful'));
}));

// POST /api/auth/register (used only by seed admin script)
router.post('/register', authenticateToken, catchAsync(async (req, res) => {
  // Only allow registration if requester is already authenticated
  // This endpoint is meant to be used by the seed script
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json(apiResponse.validationError('Email and password are required'));
  }
  
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json(apiResponse.validationError('User already exists'));
  }
  
  // Create new admin user
  const user = new User({
    email,
    passwordHash: password,
    role: 'admin'
  });
  
  await user.save();
  logMessage('auth', 'Admin user registered', { email, userId: user._id });
  res.status(201).json(apiResponse.success(null, 'Admin user created successfully'));
}));

module.exports = router;