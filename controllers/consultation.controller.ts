import { createVideoRoom, endVideoRoom, getRoomRecordings } from '../services/videoConference.service';
import Consultation from '../models/Consultation';
import asyncHandler from 'express-async-handler';
import { validateConsultationRequest } from '../validations/consultation.validations';

export const scheduleConsultation = asyncHandler(async (req: Request, res: Response) => {
  await validateConsultationRequest(req);
  
  const { patientId, doctorId, scheduledAt, duration, consultationType } = req.body;

  const consultation = await Consultation.create({
    patient: patientId,
    doctor: doctorId,
    scheduledAt,
    duration: duration || 30,
    consultationType: consultationType || 'video'
  });

  res.status(201).json({
    success: true,
    data: consultation
  });
});

export const initiateConsultation = asyncHandler(async (req: Request, res: Response) => {
  const { consultationId } = req.params;
  
  const consultation = await createVideoRoom(consultationId);
  
  res.status(200).json({
    success: true,
    data: consultation
  });
});

export const completeConsultation = asyncHandler(async (req: Request, res: Response) => {
  const { consultationId } = req.params;
  const { notes, diagnosis, followUp } = req.body;

  await endVideoRoom(consultationId);
  
  const updatedConsultation = await Consultation.findByIdAndUpdate(
    consultationId,
    { 
      notes,
      diagnosis,
      followUp: followUp ? new Date(followUp) : undefined,
      status: 'completed',
      endedAt: new Date()
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: updatedConsultation
  });
});

export const getConsultationRecordings = asyncHandler(async (req: Request, res: Response) => {
  const { consultationId } = req.params;
  
  const recordings = await getRoomRecordings(consultationId);
  
  res.status(200).json({
    success: true,
    data: recordings
  });
});

export const getUpcomingConsultations = asyncHandler(async (req: Request, res: Response) => {
  const { userId, role } = req.user;
  const { days = 7 } = req.query;

  const dateFilter = new Date();
  dateFilter.setDate(dateFilter.getDate() + Number(days));

  const query = role === 'doctor' 
    ? { doctor: userId } 
    : { patient: userId };

  const consultations = await Consultation.find({
    ...query,
    status: 'scheduled',
    scheduledAt: { $lte: dateFilter }
  })
  .populate('patient', 'name')
  .populate('doctor', 'name')
  .sort({ scheduledAt: 1 });

  res.status(200).json({
    success: true,
    count: consultations.length,
    data: consultations
  });
});