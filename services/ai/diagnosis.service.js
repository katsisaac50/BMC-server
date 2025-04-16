const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const { SyncService } = require('./sync.service');

class AIDiagnosisService {
  constructor() {
    this.model = null;
    this.syncService = new SyncService();
    this.localModelPath = path.join(__dirname, '../../ai-models/diagnosis-model.json');
    this.loadModel();
  }

  async loadModel() {
    try {
      if (fs.existsSync(this.localModelPath)) {
        this.model = await tf.loadLayersModel(`file://${this.localModelPath}`);
        console.log('Loaded local AI model');
      } else {
        await this.syncModel();
      }
    } catch (err) {
      console.error('Error loading AI model:', err);
    }
  }

  async syncModel() {
    if (!navigator.onLine) return;
    
    try {
      const cloudModel = await tf.loadLayersModel('https://your-ai-service.com/model.json');
      await cloudModel.save(`file://${this.localModelPath}`);
      this.model = cloudModel;
      console.log('AI model synced from cloud');
    } catch (err) {
      console.error('Error syncing AI model:', err);
    }
  }

  async predict(symptoms) {
    if (!this.model) {
      throw new Error('AI model not loaded');
    }

    // Convert symptoms to tensor
    const inputTensor = tf.tensor2d([this.symptomsToVector(symptoms)]);
    
    // Make prediction
    const prediction = this.model.predict(inputTensor);
    const results = await prediction.array();
    
    return this.formatDiagnosis(results[0]);
  }

  symptomsToVector(symptoms) {
    // Implementation depends on your model's expected input format
    // This is a simplified example
    return symptoms.map(sym => sym.severity);
  }

  formatDiagnosis(prediction) {
    // Map prediction to human-readable diagnosis
    return {
      conditions: [
        {
          condition: "Upper Respiratory Infection",
          confidence: prediction[0],
          explanation: "AI prediction based on symptom patterns"
        }
      ],
      suggestedTests: ["Complete Blood Count", "Throat Culture"]
    };
  }
}

module.exports = AIDiagnosisService;
