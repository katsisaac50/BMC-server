const express = require('express');
const router = express.Router();
const {getMe, register, login, logout, sendTokenResponse} = require('../controllers/auth.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
// const { rateLimit } = require('express-rate-limit');
// const { ROLES } = require('../config');

// Protected route
router.get('/protected', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// Admin-only route
router.get('/admin', protect, authorize('admin'), (req, res) => {
  res.json({ success: true, user: req.user });
});

router.post('/login', login);
router.post('/register', register);
// router.post('/send-token', sendTokenResponse);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
