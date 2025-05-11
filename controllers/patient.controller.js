const {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    addMedicalCondition,
    searchPatients
  } = require ('../services/patient.service');
  const Patient = require('../models/Patient');
  const mongoose = require ('mongoose');
  const asyncHandler = require ('express-async-handler');
  const { validatePatientCreation, validatePatientUpdate } = require ('../validations/patient.validations');
  
    const getPatients = asyncHandler(async (req, res) => {
    const { activeOnly = 'true', page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (activeOnly === 'true') filter.isActive = true;
  
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      select: '-medicalHistory -allergies -__v'
    };
  
    const patients = await getAllPatients(filter, options);
    
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  });
  
    const getPatient = asyncHandler(async (req, res) => {
      console.log("id", req.params);
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid patient ID');
      }
    const patient = await getPatientById(id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: patient
    });
  });
  
    const registerPatient = asyncHandler(async (req, res) => {
    // await validatePatientCreation(req);
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      email,
      phone,
      symptoms = [],
      medicalNotes = "no record", // fallback if missing
      medicalConditions = [],
      allergies = []
    } = req.body;

    const patientData = {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      contactInfo: {
        email,
        phone
      },
      symptoms,
      medicalHistory: {
        notes: medicalNotes,
        conditions: medicalConditions,
        allergies
      }
    };

    
    const patient = await createPatient(patientData);
    
    res.status(201).json({
      success: true,
      data: patient
    });
  });
  
    const modifyPatient = asyncHandler(async (req, res) => {
    // await validatePatientUpdate(req);
    
    const modifyPatient = asyncHandler(async (req, res) => {
      const {
        firstName,
        lastName,
        gender,
        dateOfBirth,
        email,
        phone,
        symptoms,
        medicalNotes,
        medicalConditions,
        allergies
      } = req.body;
    
      const patientData = {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(gender && { gender }),
        ...(dateOfBirth && { dateOfBirth }),
        ...(email || phone) && {
          contactInfo: {
            ...(email && { email }),
            ...(phone && { phone })
          }
        },
        ...(symptoms && { symptoms }),
        medicalHistory: {
          ...(medicalNotes && { notes: medicalNotes }),
          ...(medicalConditions && { conditions: medicalConditions }),
          ...(allergies && { allergies })
        }
      };
    
      const patient = await updatePatient(req.params.id, patientData);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: patient
    });
  });
  
    const removePatient = asyncHandler(async (req, res) => {
    const patient = await deletePatient(req.params.id);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: patient
    });
  });
  
    const recordMedicalCondition = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, diagnosedDate, status, notes } = req.body;
    
    const condition = {
      name,
      diagnosedDate: new Date(diagnosedDate),
      status: status || 'active',
      notes
    };
    
    const patient = await addMedicalCondition(id, condition);
    
    res.status(200).json({
      success: true,
      data: patient
    });
  });
  
    const findPatients = asyncHandler(async (req, res) => {
    const { q, limit = 10 } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    const patients = await searchPatients(q, parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  });

getRecentPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching recent patients:', error);
    res.status(500).json({ message: 'Failed to fetch recent patients' });
  }
};


      
     module.exports = {
     getPatients,
     getPatient,
     registerPatient,
     modifyPatient,
     removePatient,
     recordMedicalCondition,
     findPatients,
     getRecentPatients
      };