import mongoose, { Schema, Document } from 'mongoose';
import { Patient } from './Patient';
import { Staff } from './Staff';

export interface IConsultation extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  scheduledAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  duration: number; // in minutes
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  consultationType: 'video' | 'audio' | 'chat';
  meetingUrl?: string;
  recordingUrl?: string;
  notes?: string;
  prescriptions?: mongoose.Types.ObjectId[];
  diagnosis?: string;
  followUp?: Date;
}

const ConsultationSchema: Schema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  scheduledAt: { type: Date, required: true },
  startedAt: { type: Date },
  endedAt: { type: Date },
  duration: { type: Number, default: 30 }, // default 30 minutes
  status: { 
    type: String, 
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  consultationType: {
    type: String,
    enum: ['video', 'audio', 'chat'],
    required: true
  },
  meetingUrl: { type: String },
  recordingUrl: { type: String },
  notes: { type: String },
  prescriptions: [{ type: Schema.Types.ObjectId, ref: 'Prescription' }],
  diagnosis: { type: String },
  followUp: { type: Date }
}, {
  timestamps: true
});

// Indexes
ConsultationSchema.index({ patient: 1, status: 1 });
ConsultationSchema.index({ doctor: 1, status: 1 });
ConsultationSchema.index({ scheduledAt: 1 });
ConsultationSchema.index({ status: 1, scheduledAt: 1 });

export default mongoose.model<IConsultation>('Consultation', ConsultationSchema);