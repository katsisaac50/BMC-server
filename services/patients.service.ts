import Patient from '../models/Patient';
import { IPatient } from '../types/custom.types';
import logger from '../utils/logger';
import { FilterQuery, QueryOptions } from 'mongoose';

export const getRecentPatients = async (
  filter: FilterQuery<IPatient> = {},
  options: QueryOptions = {}
): Promise<IPatient[]> => {
  try {
    const defaultOptions = {
      sort: { lastVisit: -1 },
      limit: 10,
      ...options
    };

    return await Patient.find(filter)
      .sort(defaultOptions.sort)
      .limit(defaultOptions.limit)
      .select(defaultOptions.select)
      .lean();
  } catch (error) {
    logger.error('Error fetching recent patients:', error);
    throw new Error('Failed to fetch recent patients');
  }
};

// Advanced version with aggregation
export const getRecentPatientsWithDetails = async (days = 7, limit = 10) => {
  try {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    return await Patient.aggregate([
      {
        $match: {
          lastVisit: { $gte: dateThreshold },
          isActive: true
        }
      },
      {
        $sort: { lastVisit: -1 }
      },
      {
        $limit: limit
      },
      {
        $lookup: {
          from: 'appointments',
          localField: '_id',
          foreignField: 'patient',
          as: 'appointments',
          pipeline: [
            { $match: { status: { $ne: 'cancelled' } } },
            { $sort: { date: -1 } },
            { $limit: 3 }
          ]
        }
      },
      {
        $project: {
          name: 1,
          lastVisit: 1,
          status: 1,
          appointmentCount: { $size: '$appointments' },
          lastAppointment: { $arrayElemAt: ['$appointments', 0] }
        }
      }
    ]);
  } catch (error) {
    logger.error('Error in patient aggregation:', error);
    throw error;
  }
};