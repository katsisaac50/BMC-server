import Prescription from '../models/Prescription';
import Consultation from '../models/Consultation';
import { generateQR } from '../utils/qrGenerator';
import { sendSMS } from '../utils/smsService';

export const createEPrescription = async (
  consultationId: string,
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>,
  pharmacyNotes?: string
) => {
  const consultation = await Consultation.findById(consultationId)
    .populate('patient')
    .populate('doctor');
  
  if (!consultation) throw new Error('Consultation not found');

  const qrCode = await generateQR({
    patientId: consultation.patient._id,
    doctorId: consultation.doctor._id,
    date: new Date(),
    medications
  });

  const prescription = await Prescription.create({
    consultation: consultationId,
    patient: consultation.patient._id,
    doctor: consultation.doctor._id,
    medications,
    pharmacyNotes,
    qrCode
  });

  // Send notification to patient
  if (consultation.patient.phone) {
    await sendSMS(
      consultation.patient.phone,
      `Your e-prescription is ready. Show this code at any pharmacy: ${qrCode}`
    );
  }

  return prescription;
};

export const verifyPrescription = async (qrCode: string) => {
  const prescription = await Prescription.findOne({ qrCode })
    .populate('patient')
    .populate('doctor');
  
  if (!prescription) throw new Error('Invalid prescription');
  if (prescription.isFilled) throw new Error('Prescription already filled');
  if (new Date() > prescription.expiry) throw new Error('Prescription expired');

  return prescription;
};

export const markAsFilled = async (prescriptionId: string, pharmacyId: string) => {
  return await Prescription.findByIdAndUpdate(
    prescriptionId,
    { 
      isFilled: true,
      pharmacyNotes: `Filled at pharmacy: ${pharmacyId} on ${new Date().toISOString()}`
    },
    { new: true }
  );
};