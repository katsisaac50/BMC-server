const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');
const { JWT_SECRET } = require('../config/env');

/**
 * Protect routes by verifying JWT token
 */
console.log("JWT_SECRET in protect middleware:", JWT_SECRET);

console.log('JWT_SECRET in protect:', JWT_SECRET, typeof JWT_SECRET, JWT_SECRET.length);


const protect = async (req, res, next) => {
  let token;
  
  // 1. Get token from headers or cookies
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  console.log("tokening", token)

  // 2. Verify token exists
  if (!token) {
    logger.warn(`Attempt to access protected route ${req.originalUrl} without token`);
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("decoded", decoded);
    
    // 4. Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      logger.warn(`Token valid but user ${decoded.id} not found`);
      return res.status(401).json({
        success: false,
        error: 'Not authorized, user not found'
      });
    }

    // 5. Check if user changed password after token was issued
    if (user.changedPasswordAfter?.(decoded.iat)) {
      logger.warn(`User ${user.id} accessed with expired token (password changed)`);
      return res.status(401).json({
        success: false,
        error: 'User recently changed password. Please log in again'
      });
    }

    // 6. Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    logger.error('JWT verification failed:', error);
    return res.status(401).json({
      success: false,
      error: 'Not authorized, token failed'
    });
  }
};

/**
 * Restrict access based on user roles
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn(
        `User ${req.user?.id} with role ${req.user?.role} attempted to access ${req.method} ${req.originalUrl}`
      );
      return res.status(403).json({
        success: false,
        error: `User role ${req.user?.role} is not authorized to access this route`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};