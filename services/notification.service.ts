import Consultation from '../models/Consultation';
import { Server } from 'socket.io';
import logger from '../utils/logger';

export class NotificationService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.io.on('connection', (socket) => {
      logger.info(`Socket connected: ${socket.id}`);
      
      // Join room for specific user
      socket.on('join-user-room', (userId) => {
        socket.join(`user-${userId}`);
        logger.debug(`User ${userId} joined their room`);
      });

      // Join consultation room
      socket.on('join-consultation', (consultationId) => {
        socket.join(`consultation-${consultationId}`);
        logger.debug(`User joined consultation ${consultationId}`);
      });

      socket.on('disconnect', () => {
        logger.info(`Socket disconnected: ${socket.id}`);
      });
    });
  }

  public async notifyConsultationScheduled(consultationId: string) {
    const consultation = await Consultation.findById(consultationId)
      .populate('patient', 'name')
      .populate('doctor', 'name');

    if (!consultation) return;

    // Notify both doctor and patient
    this.io.to(`user-${consultation.doctor._id}`).emit('consultation-scheduled', {
      consultationId: consultation._id,
      patientName: consultation.patient.name,
      scheduledAt: consultation.scheduledAt
    });

    this.io.to(`user-${consultation.patient._id}`).emit('consultation-scheduled', {
      consultationId: consultation._id,
      doctorName: consultation.doctor.name,
      scheduledAt: consultation.scheduledAt
    });
  }

  public notifyConsultationStarting(consultationId: string) {
    this.io.to(`consultation-${consultationId}`).emit('consultation-starting', {
      consultationId,
      message: 'Consultation is about to start'
    });
  }

  public notifyRecordingAvailable(consultationId: string, recordingUrl: string) {
    this.io.to(`consultation-${consultationId}`).emit('recording-available', {
      consultationId,
      recordingUrl
    });
  }
}