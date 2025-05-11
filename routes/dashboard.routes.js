// routes/dashboard.routes.js
const express = require('express');
const router = express.Router();
const { cacheResponse } = require('../middleware/cache.middleware');
const { protect, authorize } = require('../middleware/auth.middleware');
// const { getDashboardStats } = require('../controllers/dashboard.controller');
// In your route definitions
const { getCombinedStats } = require('../controllers/dashboard.controller');

router.get('/stats', 
  cacheResponse('dashboard_stats', 300),
  protect, authorize('admin'),
  getCombinedStats
);

// router.get('/stats', protect, authorize('admin'), getDashboardStats);

module.exports = router;