const patientModel = require('../models/patient.model');

module.exports = {
  getAllPatients: (req, res) => {
    res.json(patientModel.getAll());
  },
  getPatient: (req, res) => {
    const patient = patientModel.getById(req.params.id);
    patient ? res.json(patient) : res.status(404).json({ message: 'Patient not found' });
  },
  createPatient: (req, res) => {
    const newPatient = patientModel.create(req.body);
    res.status(201).json(newPatient);
  },
  updatePatient: (req, res) => {
    const updatedPatient = patientModel.update(req.params.id, req.body);
    updatedPatient ? res.json(updatedPatient) : res.status(404).json({ message: 'Patient not found' });
  },
  deletePatient: (req, res) => {
    patientModel.delete(req.params.id);
    res.json({ message: 'Patient deleted successfully' });
  }
};
