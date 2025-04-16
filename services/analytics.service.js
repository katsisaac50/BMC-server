const tf = require('@tensorflow/tfjs-node');
const Patient = require('../models/patient.model');

class PredictiveAnalyticsService {
  constructor() {
    this.readmissionModel = null;
    this.loadModels();
  }

  async loadModels() {
    this.readmissionModel = await tf.loadLayersModel(
      'file://./ai-models/readmission-model.json'
    );
  }

  async predictReadmissionRisk(patientId) {
    const patient = await Patient.findById(patientId);
    const input = this.preparePatientData(patient);
    
    const prediction = this.readmissionModel.predict(input);
    const riskScore = (await prediction.data())[0];
    
    return {
      riskScore,
      riskLevel: riskScore > 0.7 ? 'High' : riskScore > 0.4 ? 'Medium' : 'Low',
      factors: this.identifyRiskFactors(patient)
    };
  }

  preparePatientData(patient) {
    // Convert patient data to model input format
    // This would be specific to your model's requirements
    return tf.tensor2d([[patient.age, patient.gender === 'Male' ? 1 : 0]]);
  }

  identifyRiskFactors(patient) {
    // Analyze patient data for risk factors
    const factors = [];
    if (patient.medicalHistory.includes('Diabetes')) factors.push('Diabetes');
    if (patient.age > 65) factors.push('Advanced age');
    return factors;
  }
}

module.exports = PredictiveAnalyticsService;
