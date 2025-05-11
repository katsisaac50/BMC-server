const Patient = require('../models/Patient');
const Alert = require('../models/Alert');
const Appointment = require('../models/appointment.model');
const Staff = require('../models/Staff');
// const { IDashboardStats } = require('../types/custom.types');
const logger = require('../utils/logger');

const getDashboardStats = async () => {
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
    if (logger?.error) {
      logger.error('Error fetching dashboard stats:', error);
    } else {
      console.error('Fallback logger:', error);
    }
    throw new Error('Failed to fetch dashboard statistics');
  }  
};

const getAlertStatsByPriority = async () => {
    const priorities = ['high', 'medium', 'low'];
  
    const stats = await Promise.all(
      priorities.map(async (level) => {
        const count = await Alert.countDocuments({ priority: level, isRead: false });
        return { priority: level, count };
      })
    );
  
    return stats;
  };

module.exports = {
  getDashboardStats,
    getAlertStatsByPriority
};
// This code defines a service for fetching dashboard statistics in a healthcare application.
// It includes a function `getDashboardStats` that retrieves various statistics such as the total number of patients,
// active cases, today's appointments, unread alerts, and available staff.
// The function uses Mongoose to count documents in the respective collections and returns an object containing the statistics.
// The function is wrapped in a try-catch block to handle any potential errors during the database operations.
// The service is then exported for use in other parts of the application.
// The code is structured to be modular and reusable, allowing for easy integration into a larger application.
// The use of async/await syntax makes the code more readable and easier to maintain.
// The function also logs any errors that occur during the execution, providing better visibility into potential issues.
// The statistics can be used to provide insights into the current state of the healthcare facility,
// helping staff make informed decisions and improve patient care.
// The code is designed to be efficient, using Promise.all to run multiple database queries in parallel,
// reducing the overall execution time.
// The statistics returned by the function can be used to create a dashboard that provides an overview of the facility's operations,
// allowing staff to quickly assess the current situation and respond accordingly.
// The function can be easily extended to include additional statistics or modified to filter the data based on specific criteria,
// making it a flexible solution for various reporting needs.