const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        error: 'Invalid token or user deactivated.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      error: 'Invalid token.' 
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Admin role middleware
const adminAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Access denied. Authentication required.' 
    });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Access denied. Admin role required.' 
    });
  }
  
  next();
};

module.exports = {
  generateToken,
  auth,
  optionalAuth,
  adminAuth
};
