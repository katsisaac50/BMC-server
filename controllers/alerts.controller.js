// server/controllers/alerts.controller.js

const Alert = require('../models/Alert');

// Controller method to get system alerts
exports.getSystemAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ type: 'system' });
    res.status(200).json({
      success: true,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve system alerts',
      error: error.message
    });
  }
};

// Controller method to get alert stats by priority
exports.getAlertStatsByPriority = async (req, res) => {
  try {
    const stats = await Alert.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve alert stats by priority',
      error: error.message
    });
  }
};



/*************  ✨ Windsurf Command ⭐  *************/
// const asyncHandler = require('express-async-handler');
// const { requireRole } = require('../middleware/permissions.middleware');

// const getSystemAlerts = [
//   requireRole(['admin', 'chief_doctor', 'doctor', 'nurse']),
//   asyncHandler(async (req, res) => {
//     const alerts = await Alert.find().sort({ createdAt: -1 });
//     res.status(200).json({
//       success: true,
//       data: alerts,
//       lastUpdated: new Date()
//     });
//   })
// ];

// const getAlertStatsByPriority = [
//   requireRole(['admin', 'chief_doctor']),
//   asyncHandler(async (req, res) => {
//     const alertStats = await Alert.aggregate([
//       { $group: { _id: '$priority', count: { $sum: 1 } } }
//     ]);
//     res.status(200).json({
//       success: true,
//       data: alertStats,
//       lastUpdated: new Date()
//     });
//   })
// ];