// services/emergency.service.ts
import { sendSMS, makePhoneCall } from './communicationService';

export const handleEmergency = async (consultationId: string) => {
  const consultation = await Consultation.findById(consultationId)
    .populate('patient')
    .populate('doctor');
  
  if (!consultation) throw new Error('Consultation not found');

  // 1. Notify on-call emergency staff
  await sendSMS(
    process.env.EMERGENCY_PHONE,
    `Emergency in consultation ${consultationId} with patient ${consultation.patient.name}`
  );

  // 2. Start recording if not already
  await Consultation.findByIdAndUpdate(consultationId, {
    isRecording: true,
    status: 'emergency'
  });

  // 3. Connect nearest emergency contact
  if (consultation.patient.emergencyContact) {
    await makePhoneCall(
      consultation.patient.emergencyContact.phone,
      `Emergency alert for ${consultation.patient.name}. Please join consultation at [URL]`
    );
  }

  // 4. Log emergency protocol activation
  await AuditLog.create({
    action: 'emergency_protocol_activated',
    entity: 'consultation',
    entityId: consultationId,
    metadata: {
      patient: consultation.patient._id,
      doctor: consultation.doctor._id,
      timestamp: new Date()
    }
  });
};