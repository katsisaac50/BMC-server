import {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    addMedicalCondition,
    searchPatients
  } from '../services/patient.service';
  import asyncHandler from 'express-async-handler';
  import { validatePatientCreation, validatePatientUpdate } from '../validations/patient.validations1';
  
  export const getPatients = asyncHandler(async (req, res) => {
    const { activeOnly = 'true', page = 1, limit = 10 } = req.query;
    
    const filter: any = {};
    if (activeOnly === 'true') filter.isActive = true;
  
    const options = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      select: '-medicalHistory -allergies -__v'
    };
  
    const patients = await getAllPatients(filter, options);
    
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  });
  
  export const getPatient = asyncHandler(async (req, res) => {
    const patient = await getPatientById(req.params.id);
    
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
  
  export const registerPatient = asyncHandler(async (req, res) => {
    await validatePatientCreation(req);
    
    const patient = await createPatient(req.body);
    
    res.status(201).json({
      success: true,
      data: patient
    });
  });
  
  export const modifyPatient = asyncHandler(async (req, res) => {
    await validatePatientUpdate(req);
    
    const patient = await updatePatient(req.params.id, req.body);
    
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
  
  export const removePatient = asyncHandler(async (req, res) => {
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
  
  export const recordMedicalCondition = asyncHandler(async (req, res) => {
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
  
  export const findPatients = asyncHandler(async (req, res) => {
    const { q, limit = 10 } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    const patients = await searchPatients(q, parseInt(limit as string));
    
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
  });