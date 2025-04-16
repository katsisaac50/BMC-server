import express from 'express';
import {
  getPatients,
  getPatient,
  registerPatient,
  modifyPatient,
  removePatient,
  recordMedicalCondition,
  findPatients
} from '../controllers/patient.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin', 'doctor', 'nurse'), getPatients)
  .post(protect, authorize('admin', 'receptionist'), registerPatient);

router.route('/search')
  .get(protect, authorize('admin', 'doctor', 'nurse'), findPatients);

router.route('/:id')
  .get(protect, authorize('admin', 'doctor', 'nurse'), getPatient)
  .put(protect, authorize('admin', 'receptionist'), modifyPatient)
  .delete(protect, authorize('admin'), removePatient);

router.route('/:id/conditions')
  .post(protect, authorize('admin', 'doctor'), recordMedicalCondition);

export default router;