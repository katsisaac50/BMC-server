const { Request, Response } = require('express');
const {
  getDashboardStats,
  getAlertStatsByPriority,
  getDepartmentSpecificStats,
  generatePDFReport
} = require('../services/stats.service');
const asyncHandler = require('express-async-handler');
const { requireRole } = require('../middleware/permissions.middleware');
const { cacheResponse } = require('../middleware/cache.middleware');
const redisClient = require('../utils/redis');

const getCombinedStats = [
  requireRole(['admin', 'chief_doctor']),
  asyncHandler(async (req, res) => {
    // Cache for 5 minutes (300 seconds)
    await cacheResponse('dashboard_stats', 300);
    
    const [stats, alertStats] = await Promise.all([
      getDashboardStats(),
      getAlertStatsByPriority()
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...stats,
        alertStats
      },
      lastUpdated: new Date(),
      cache: {
        status: 'HIT', // Will be set by cache middleware
        ttl: 300
      }
    });
  })
];

const getDepartmentStats = [
  requireRole(['admin', 'chief_doctor', 'doctor']),
  asyncHandler(async (req, res) => {
    const { department } = req.params;
    
    // Department-specific cache key
    const cacheKey = `dept_stats:${department}`;
    await cacheResponse(cacheKey, 180); // Cache for 3 minutes
    
    const stats = await getDepartmentSpecificStats(department);
    
    res.status(200).json({
      success: true,
      data: stats,
      lastUpdated: new Date()
    });
  })
];

const generateStatsReport = [
  requireRole(['admin', 'chief_doctor']),
  asyncHandler(async (req, res) => {
    const stats = await getDashboardStats();
    const pdf = await generatePDFReport(stats);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition', 
      `attachment; filename=report_${new Date().toISOString().split('T')[0]}.pdf`
    );
    res.send(pdf);
  })
];

const getRealTimeStats = [
  requireRole(['admin', 'chief_doctor']),
  asyncHandler(async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Initial data
    const stats = await getDashboardStats();
    res.write(`data: ${JSON.stringify(stats)}\n\n`);
    
    // Subscribe to updates
    const listener = (message) => {
      res.write(`data: ${message}\n\n`);
    };
    
    redisClient.on('message', listener);
    
    // Cleanup on disconnect
    req.on('close', () => {
      redisClient.off('message', listener);
    });
  })
];

const getAlertStats = [
  requireRole(['admin', 'chief_doctor']),
  asyncHandler(async (req, res) => {
    const alertStats = await getAlertStatsByPriority();
    
    res.status(200).json({
      success: true,
      data: alertStats,
      lastUpdated: new Date()
    });
  })
];

module.exports = {
  getCombinedStats,
  getDepartmentStats,
  generateStatsReport,
  getRealTimeStats,
  getAlertStats
};