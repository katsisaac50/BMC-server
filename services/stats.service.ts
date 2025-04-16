import Patient from '../models/Patient';
import Alert from '../models/Alert';
import Appointment from '../models/Appointment';
import Staff from '../models/Staff';
import { IDashboardStats } from '../types/custom.types';
import logger from '../utils/logger';

export const getDashboardStats = async (): Promise<IDashboardStats> => {
  try {
    const [
      totalPatients,
      activeCases,
      todaysAppointments,
      unreadAlerts,
      availableStaff
    ] = await Promise.all([
      Patient.countDocuments({ isActive: true }),
      Patient.countDocuments({ status: 'active' }),
      Appointment.countDocuments({ 
        date: { 
          $gte: new Date().setHours(0, 0, 0, 0),
          $lt: new Date().setHours(23, 59, 59, 999)
        }
      }),
      Alert.countDocuments({ isRead: false }),
      Staff.countDocuments({ isAvailable: true })
    ]);

    return {
      totalPatients,
      activeCases,
      appointmentsToday: todaysAppointments,
      unreadAlerts,
      availableStaff
    };
  } catch (error) {
    logger.error('Error fetching dashboard stats:', error);
    throw new Error('Failed to fetch dashboard statistics');
  }
};