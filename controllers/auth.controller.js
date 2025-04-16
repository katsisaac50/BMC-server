const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

module.exports = {
  login: async (req, res) => {
    const { username, password } = req.body;
    const user = userModel.findByUsername(username);

    if (!user || !userModel.comparePassword(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: userModel.findById(user.id) });
  },

  getCurrentUser: (req, res) => {
    // console.log('Current user:', req.user);
    res.json(req.user);
    
  },

  logout: (req, res) => {
    res.json({ message: 'Logged out successfully' });
  }
};
