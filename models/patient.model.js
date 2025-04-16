let patients = [
  { 
    id: '1', 
    name: 'John Doe', 
    age: 35, 
    gender: 'Male', 
    medicalHistory: 'Hypertension', 
    contact: 'john@example.com',
    dateOfBirth: new Date('1988-05-15'),
    lastVisitDate: new Date()
  }
];

module.exports = {
  getAll: () => patients,
  getById: (id) => patients.find(p => p.id === id),
  create: (patient) => {
    const newPatient = { id: Date.now().toString(), ...patient };
    patients.push(newPatient);
    return newPatient;
  },
  update: (id, updates) => {
    const index = patients.findIndex(p => p.id === id);
    if (index !== -1) {
      patients[index] = { ...patients[index], ...updates };
      return patients[index];
    }
    return null;
  },
  delete: (id) => {
    patients = patients.filter(p => p.id !== id);
  }
};
