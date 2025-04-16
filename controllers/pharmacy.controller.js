const medicationModel = require('../models/medication.model');

module.exports = {
  getAllMedications: (req, res) => {
    console.log('Fetching all medications');
    // Log the request method and URL
    console.log(`Request Method: ${req.method}`);
    console.log(`Request URL: ${req.originalUrl}`);
    // Log the request headers
    console.log('Request getAll():', medicationModel.getAll());
    // Fetch all medications from the model
    // This is a placeholder. Replace with actual data fetching logic.
    // For example, if using a database, you would query the database here.
    // const medications = await medicationModel.getAll();
    // For now, we'll just return a static response.
    // const medications = [
    //   { id: 1, name: 'Aspirin', quantity: 100 },
    //   { id: 2, name: 'Ibuprofen', quantity: 50 },
    //   { id: 3, name: 'Paracetamol', quantity: 200 },
    // ];
    // console.log('Medications:', medications);
    // res.json(medications);
    // const medications = medicationModel.getAll();
    // console.log('Medications:', medications);
    // res.json(medications);
    
    res.json(medicationModel.getAll());
  },
  getMedication: (req, res) => {
    const medication = medicationModel.getById(req.params.id);
    medication ? res.json(medication) : res.status(404).json({ message: 'Medication not found' });
  },
  createMedication: (req, res) => {
    const newMedication = medicationModel.create(req.body);
    res.status(201).json(newMedication);
  },
  updateStock: (req, res) => {
    const updatedMedication = medicationModel.updateStock(req.params.id, req.body.quantity);
    updatedMedication ? res.json(updatedMedication) : res.status(404).json({ message: 'Medication not found' });
  },
  deleteMedication: (req, res) => {
    const deletedMedication = medicationModel.delete(req.params.id);
    deletedMedication ? res.json(deletedMedication) : res.status(404).json({ message: 'Medication not found' });
  },
  // Add more controller methods as needed
  // For example, to handle prescriptions:
  // getAllPrescriptions: (req, res) => {
  //   const prescriptions = prescriptionModel.getAll();
  //   res.json(prescriptions);
  // },
  // getPrescription: (req, res) => {
  //   const prescription = prescriptionModel.getById(req.params.id);
  //   prescription ? res.json(prescription) : res.status(404).json({ message: 'Prescription not found' });
  // },
  // createPrescription: (req, res) => {
  //   const newPrescription = prescriptionModel.create(req.body);
  //   res.status(201).json(newPrescription);
  // },
  // updatePrescription: (req, res) => {
  //   const updatedPrescription = prescriptionModel.update(req.params.id, req.body);
  //   updatedPrescription ? res.json(updatedPrescription) : res.status(404).json({ message: 'Prescription not found' });
  // },
  // deletePrescription: (req, res) => {
  //   const deletedPrescription = prescriptionModel.delete(req.params.id);
  //   deletedPrescription ? res.json(deletedPrescription) : res.status(404).json({ message: 'Prescription not found' });
  // },
  // Add more methods for handling prescriptions and other entities as needed
};
