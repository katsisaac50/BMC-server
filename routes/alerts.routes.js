const express = require('express');
const router = express.Router();
const alertsController = require('../controllers/alerts.controller');

router.get('/system', alertsController.getSystemAlerts);
router.get('/alerts/stats', alertsController.getAlertStatsByPriority);

module.exports = router;