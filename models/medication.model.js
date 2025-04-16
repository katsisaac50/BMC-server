let medications = [
  { 
    id: '1', 
    name: 'Paracetamol', 
    description: 'Pain reliever', 
    quantity: 100, 
    price: 5.99, 
    expiryDate: '2024-12-31', 
    supplier: 'Pharma Inc.' 
  }
];

module.exports = {
  getAll: () => medications,
  getById: (id) => medications.find(m => m.id === id),
  create: (medication) => {
    const newMedication = { id: Date.now().toString(), ...medication };
    medications.push(newMedication);
    return newMedication;
  },
  updateStock: (id, quantity) => {
    const medication = medications.find(m => m.id === id);
    if (medication) {
      medication.quantity += quantity;
      return medication;
    }
    return null;
  },
  delete: (id) => {
    const index = medications.findIndex(m => m.id === id);
    if (index !== -1) {
      return medications.splice(index, 1)[0];
    }
    return null;
  }
};
