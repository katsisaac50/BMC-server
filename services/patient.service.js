const Patient = require('../models/Patient');
const { generateMedicalRecordNumber, escapeRegExp } = require('../utils/helpers');
const logger = require('../utils/logger');
const { FilterQuery, QueryOptions, UpdateQuery } = require('mongoose');

/**
 * Get all patients with optional filters and sorting
 */
const getAllPatients = async (filter = {}, options = {}) => {
  try {
    const defaultOptions = {
      sort: { lastName: 1, firstName: 1 },
      lean: true,
      ...options,
    };

    return await Patient.find(filter, null, defaultOptions);
  } catch (error) {
    logger.error('Error fetching patients:', error);
    throw new Error('Failed to fetch patients');
  }
};

/**
 * Get a single patient by ID
 */
const getPatientById = async (id) => {
  try {
    return await Patient.findById(id).lean();
  } catch (error) {
    logger.error(`Error fetching patient with ID ${id}:`, error);
    throw new Error('Failed to fetch patient');
  }
};

/**
 * Create a new patient with generated medical record number
 */
const createPatient = async (patientData) => {
  try {
    const medicalRecordNumber = await generateMedicalRecordNumber();
    const newPatient = await Patient.create({
      ...patientData,
      medicalRecordNumber,
    });
    return newPatient.toObject();
  } catch (error) {
    logger.error('Error creating patient:', error);
    throw new Error('Failed to create patient');
  }
};

/**
 * Update an existing patient
 */
const updatePatient = async (id, updates, options = { new: true, runValidators: true }) => {
  try {
    return await Patient.findByIdAndUpdate(id, updates, options).lean();
  } catch (error) {
    logger.error(`Error updating patient with ID ${id}:`, error);
    throw new Error('Failed to update patient');
  }
};

/**
 * Soft delete a patient (isActive = false)
 */
const deletePatient = async (id) => {
  try {
    return await Patient.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).lean();
  } catch (error) {
    logger.error(`Error deleting patient with ID ${id}:`, error);
    throw new Error('Failed to delete patient');
  }
};

/**
 * Add a medical condition to a patient's history
 */
const addMedicalCondition = async (patientId, condition) => {
  try {
    return await Patient.findByIdAndUpdate(
      patientId,
      { $push: { medicalHistory: condition } },
      { new: true, runValidators: true }
    ).lean();
  } catch (error) {
    logger.error(`Error adding medical condition to patient ${patientId}:`, error);
    throw new Error('Failed to add medical condition');
  }
};

/**
 * Smart search for patients using full-text or fallback regex
 */
const searchPatients = async (query, filters = {}, options = {}) => {
  const { limit = 10, page = 1 } = options;
  const skip = (page - 1) * limit;

  const searchRegex = new RegExp(escapeRegExp(query), 'i');

  const searchQuery = {
    $and: [
      { isActive: true },
      filters,
      {
        $or: [
          { fullName: searchRegex },
          { email: searchRegex },
          { phone: searchRegex },
          { 'address.text': searchRegex },
          { medicalRecordNumber: searchRegex },
        ]
      }
    ]
  };

  try {
    const [patients, total] = await Promise.all([
      Patient.find(searchQuery)
        .skip(skip)
        .limit(limit)
        .sort({ lastName: 1, firstName: 1 })
        .lean(),
      Patient.countDocuments(searchQuery)
    ]);

    return {
      patients,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    };
  } catch (error) {
    logger.error(`Error searching patients with query "${query}":`, error);
    throw new Error('Failed to search patients');
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
  addMedicalCondition,
  searchPatients,
};
// const { generateMedicalRecordNumber } = require('../utils/helpers');