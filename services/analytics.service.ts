import { Patient } from '../models/Patient';
import { Appointment } from '../models/Appointment';
import { Alert } from '../models/Alert.js/index.js';
import mongoose from 'mongoose';

export const getPatientDemographics = async () => {
  return await Patient.aggregate([
    {
      $facet: {
        genderDistribution: [
          { $group: { _id: '$gender', count: { $sum: 1 } } }
        ],
        ageDistribution: [
          {
            $project: {
              age: {
                $floor: {
                  $divide: [
                    { $subtract: [new Date(), '$dateOfBirth'] },
                    31557600000 // milliseconds in a year
                  ]
                }
              }
            }
          },
          {
            $bucket: {
              groupBy: '$age',
              boundaries: [0, 18, 30, 40, 50, 60, 70, 80, 90, 100],
              default: '100+',
              output: {
                count: { $sum: 1 }
              }
            }
          }
        ],
        bloodTypeDistribution: [
          { $match: { bloodType: { $exists: true } } },
          { $group: { _id: '$bloodType', count: { $sum: 1 } } }
        ]
      }
    }
  ]);
};

export const getAppointmentTrends = async (months = 12) => {
  const dateThreshold = new Date();
  dateThreshold.setMonth(dateThreshold.getMonth() - months);

  return await Appointment.aggregate([
    {
      $match: {
        date: { $gte: dateThreshold }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
          status: '$status'
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    },
    {
      $group: {
        _id: {
          year: '$_id.year',
          month: '$_id.month'
        },
        statuses: {
          $push: {
            status: '$_id.status',
            count: '$count'
          }
        },
        total: { $sum: '$count' }
      }
    },
    {
      $project: {
        _id: 0,
        period: {
          $dateToString: {
            format: '%Y-%m',
            date: {
              $dateFromParts: {
                year: '$_id.year',
                month: '$_id.month'
              }
            }
          }
        },
        statuses: 1,
        total: 1
      }
    }
  ]);
};

export const getAlertResponseTimes = async () => {
  return await Alert.aggregate([
    {
      $match: {
        isRead: true,
        readAt: { $exists: true },
        createdAt: { $exists: true }
      }
    },
    {
      $project: {
        priority: 1,
        responseTime: {
          $divide: [
            { $subtract: ['$readAt', '$createdAt'] },
            60000 // convert to minutes
          ]
        }
      }
    },
    {
      $group: {
        _id: '$priority',
        averageResponseTime: { $avg: '$responseTime' },
        minResponseTime: { $min: '$responseTime' },
        maxResponseTime: { $max: '$responseTime' }
      }
    }
  ]);
};