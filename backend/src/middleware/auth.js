const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('[Auth Debug] Header:', authHeader);
  console.log('[Auth Debug] Token found:', !!token);

  if (!token) {
    console.log('[Auth Debug] No token provided');
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[Auth Debug] Token decoded:', { id: decoded.id, iat: decoded.iat, exp: decoded.exp });

    req.user = await User.findById(decoded.id).select('-passwordHash');
    console.log('[Auth Debug] User found:', !!req.user, req.user ? req.user.email : 'null');

    if (!req.user) {
      console.log('[Auth Debug] User lookup failed for ID:', decoded.id);
      // If token is valid but user not found, strictly it's 401 or 403, but let's be clear
    }

    next();
  } catch (error) {
    console.error('[Auth Debug] Verification error:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expired', error: error.message });
    }

    if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
      return res.status(403).json({ message: 'Invalid token', error: error.message });
    }

    // For other errors (like DB connection failed), return 500
    return res.status(500).json({ message: 'Internal Server Error during auth', error: error.message });
  }
};

module.exports = { authenticateToken };