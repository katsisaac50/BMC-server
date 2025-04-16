import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import Patient from '../models/Patient';
import fs from 'fs';
import path from 'path';

export const generatePatientReport = async (patientId: string) => {
  const patient = await Patient.findById(patientId)
    .populate('appointments')
    .populate('prescriptions')
    .lean();

  if (!patient) {
    throw new Error('Patient not found');
  }

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Add content
  page.drawText(`Patient Report: ${patient.name}`, {
    x: 50,
    y: height - 50,
    size: 20,
    font,
    color: rgb(0, 0, 0)
  });

  // Add patient details
  let yPosition = height - 100;
  const addText = (text: string, size = 12) => {
    page.drawText(text, { x: 50, y: yPosition, size, font });
    yPosition -= size + 10;
  };

  addText(`Date of Birth: ${patient.dateOfBirth?.toLocaleDateString() || 'N/A'}`);
  addText(`Gender: ${patient.gender || 'N/A'}`);
  addText(`Blood Type: ${patient.bloodType || 'N/A'}`);
  addText(`Last Visit: ${patient.lastVisit.toLocaleDateString()}`);
  addText(`Status: ${patient.status}`);

  // Add appointments section
  yPosition -= 20;
  addText('Recent Appointments:', 14);
  patient.appointments?.forEach(appt => {
    addText(`${appt.date.toLocaleDateString()} - ${appt.reason}`);
  });

  // Save to file
  const reportsDir = path.join(__dirname, '../../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
  }

  const filename = `patient_${patient._id}_${Date.now()}.pdf`;
  const filepath = path.join(reportsDir, filename);
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(filepath, pdfBytes);

  return {
    filepath,
    filename,
    patient
  };
};