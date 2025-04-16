import { Request, Response } from 'express';
import { getDashboardStats, getAlertStatsByPriority } from '../services/stats.service';
import asyncHandler from 'express-async-handler';
import { cacheResponse } from '../middleware/cache.middleware';
import { IDashboardStats } from '../types/custom.types';

export const getStats = asyncHandler(async (req: Request, res: Response) => {
  // Cache for 5 minutes
  await cacheResponse('dashboard_stats', 300);
  
  const stats: IDashboardStats = await getDashboardStats();
  const alertStats = await getAlertStatsByPriority();
  
  res.status(200).json({
    success: true,
    data: {
      ...stats,
      alertStats
    }
  });
});