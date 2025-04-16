const express = require('express');
const router = express.Router();

const pharmacyRoutes = require('./pharmacy.routes');
const authRoutes = require('./auth.routes');
const aiModelRoutes = require('./aiModel.routes');
// Add more route files as needed
const patientRoutes = require('./patient.routes');
// const labRoutes = require('./lab');
console.log('Pharmacy routes loaded');
router.use('/pharmacy/medications', pharmacyRoutes);
router.use('/pharmacy/medications/:id', pharmacyRoutes);
router.use('/pharmacy/medications/:id/stock', pharmacyRoutes);

// Add routes for AI model and other entities as needed

router.use('/model', aiModelRoutes)
// router.use('/ai', aiModelRoutes);
// router.use('/model/:id/stock', aiModelRoutes);

// Add routes for prescriptions and other entities as needed
router.use('/pharmacy/prescriptions', pharmacyRoutes);

// Auth route
router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
// router.use('/lab', labRoutes);

module.exports = router;
