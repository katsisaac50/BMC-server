import Patient from '../models/Patient';

export const generateMedicalRecordNumber = async () => {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const prefix = `MRN-${currentYear}-`;
  
  const lastPatient = await Patient.findOne(
    { medicalRecordNumber: new RegExp(`^${prefix}`) },
    { medicalRecordNumber: 1 },
    { sort: { medicalRecordNumber: -1 } }
  ).lean();
  
  let sequence = 1;
  if (lastPatient?.medicalRecordNumber) {
    const lastSeq = parseInt(lastPatient.medicalRecordNumber.split('-').pop() || '0');
    sequence = lastSeq + 1;
  }
  
  return `${prefix}${sequence.toString().padStart(6, '0')}`;
};

export const calculateAge = (dateOfBirth: Date) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};