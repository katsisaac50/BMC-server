require('dotenv').config();
const path = require('path');

module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  TEMPLATES_DIR: path.join(__dirname, '../../templates'),
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000,
    max: 100
  },
  ROLES: {
    ADMIN: 'admin',
    DOCTOR: 'doctor',
    NURSE: 'nurse',
    PHARMACIST: 'pharmacist',
    STAFF: 'staff',
    LAB_TECH: 'lab_tech'
  }
};
