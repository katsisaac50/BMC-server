const express = require('express');
const router = express.Router();
const patientsController = require('../controllers/patients.controller');
const { authenticate } = require('../utils/auth');

router.get('/', patientsController.getAllPatients);
router.get('/:id', patientsController.getPatient);
router.post('/', authenticate, patientsController.createPatient);
router.put('/:id', authenticate, patientsController.updatePatient);
router.delete('/:id', authenticate, patientsController.deletePatient);

module.exports = router;
