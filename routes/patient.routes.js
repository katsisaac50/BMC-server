const express = require ('express');
const {
  getPatients,
  getPatient,
  registerPatient,
  modifyPatient,
  removePatient,
  recordMedicalCondition,
  findPatients,
  getRecentPatients
} = require ('../controllers/patient.controller');

const {
  validatePatientCreation,
  validatePatientUpdate,
  validatePatientId
} = require('../validations/patient.validations');

const { protect, authorize } = require ('../middleware/auth.middleware');

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin', 'doctor', 'nurse'), getPatients)
  .post(protect, authorize('admin', 'receptionist'), registerPatient);

router.route('/search')
  .get(protect, authorize('admin', 'doctor', 'nurse'), findPatients);

  router.get('/recent', protect, authorize('admin', 'doctor', 'nurse'), getRecentPatients);

  router.route('/:id')
  .get(protect, authorize('admin', 'doctor', 'nurse'), validatePatientId, getPatient)
  .put(protect, authorize('admin', 'receptionist'), validatePatientId, validatePatientUpdate, modifyPatient)
  .delete(protect, authorize('admin' , 'doctor'), validatePatientId, removePatient);

  router.route('/:id/conditions')
  .post(protect, authorize('admin', 'doctor'), validatePatientId, recordMedicalCondition);

module.exports= router;