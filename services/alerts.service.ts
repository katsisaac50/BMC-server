import Alert from '../models/Alert.js/index.js';
import { IAlert } from '../types/custom.types';
import logger from '../utils/logger';
import { FilterQuery, QueryOptions } from 'mongoose';

export const getSystemAlerts = async (
  filter: FilterQuery<IAlert> = {},
  options: QueryOptions = {}
): Promise<IAlert[]> => {
  try {
    const defaultOptions = {
      sort: { createdAt: -1 },
      limit: 20,
      ...options
    };

    return await Alert.find(filter)
      .sort(defaultOptions.sort)
      .limit(defaultOptions.limit)
      .populate('relatedPatient', 'name')
      .populate('relatedStaff', 'name role')
      .lean();
  } catch (error) {
    logger.error('Error fetching system alerts:', error);
    throw new Error('Failed to fetch system alerts');
  }
};

// Priority-based alert aggregation
export const getAlertStatsByPriority = async () => {
  try {
    return await Alert.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
          unread: {
            $sum: { $cond: [{ $eq: ['$isRead', false] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          priority: '$_id',
          count: 1,
          unread: 1,
          _id: 0
        }
      },
      {
        $sort: { 
          priorityOrder: {
            $switch: {
              branches: [
                { case: { $eq: ['$priority', 'critical'] }, then: 1 },
                { case: { $eq: ['$priority', 'high'] }, then: 2 },
                { case: { $eq: ['$priority', 'medium'] }, then: 3 },
                { case: { $eq: ['$priority', 'low'] }, then: 4 }
              ],
              default: 5
            }
          }
        }
      }
    ]);
  } catch (error) {
    logger.error('Error in alert aggregation:', error);
    throw error;
  }
};