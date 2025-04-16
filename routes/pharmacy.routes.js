const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacy.controller'); // update path if needed

// Get all medications
router.get('/', pharmacyController.getAllMedications);

// Get medication by ID
router.get('/:id', pharmacyController.getMedication);

// Create new medication
router.post('/', pharmacyController.createMedication);

// Update stock for a medication
router.put('/:id/stock', pharmacyController.updateStock);

router.delete('/:id', pharmacyController.deleteMedication);


// Get all prescriptions


// // Get all medications
// router.get('/', (req, res) => {
//   const meds = pharmacyController.getAllMedications();
//   res.json(meds);
// });

// // Get medication by ID
// router.get('/:id', (req, res) => {
//   const med = pharmacyController.getMedication(req.params.id);
//   if (med) {
//     res.json(med);
//   } else {
//     res.status(404).json({ message: 'Medication not found' });
//   }
// });

// // Create new medication
// router.post('/', (req, res) => {
//   const newMed = pharmacyController.createMedication(req.body);
//   res.status(201).json(newMed);
// });

// // Update stock for a medication
// router.put('/:id/stock', (req, res) => {
//   const updatedMed = pharmacyController.updateStock(req.params.id, req.body.quantity);
//   if (updatedMed) {
//     res.json(updatedMed);
//   } else {
//     res.status(404).json({ message: 'Medication not found' });
//   }
// });

module.exports = router;
