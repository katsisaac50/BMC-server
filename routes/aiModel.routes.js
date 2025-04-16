// routes/aiModel.ts
const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

router.get('/model/download', aiController.downloadModel);
// router.get('/model/upload', aiController.uploadModel); // Upload model endpoint
router.post('/model/upload', aiController.trainModel); // Train model endpoint
router.get('/model/meta', aiController.evaluateModel); // Predict endpoint
// router.get('/sync', aiController.syncModel); // Sync model endpoint 
router.post('/diagnosis', aiController.getAIDiagnosis); // AI diagnosis endpoint
// router.post('/model/treatment-plan', aiController.generateAITreatmentPlan); // AI treatment plan endpoint

module.exports = router;

