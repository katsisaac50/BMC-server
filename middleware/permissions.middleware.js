const requireRole = (roles) => {
    return (req, res, next) => {
      const user = req.user; // Assumes req.user is set from auth middleware
  
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions.'
        });
      }
  
      next();
    };
  };
  
  module.exports = {
    requireRole
  };
  