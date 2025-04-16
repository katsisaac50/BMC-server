const jwt = require('jsonwebtoken');
const { JWT_SECRET, ROLES } = require('../config');
const userModel = require('../models/user.model');

module.exports = {
  authenticate: (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = userModel.findById(decoded.userId);
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  },

  authorize: (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      next();
    };
  }
};
