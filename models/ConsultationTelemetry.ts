import mongoose, { Schema, Document } from 'mongoose';

interface ITelemetryEvent {
  timestamp: Date;
  eventType: 'join' | 'leave' | 'quality-change' | 'tool-used' | 'recording';
  data: any;
}

export interface IConsultationTelemetry extends Document {
  consultation: mongoose.Types.ObjectId;
  participants: Array<{
    userId: mongoose.Types.ObjectId;
    role: 'doctor' | 'patient' | 'observer';
    joinTime: Date;
    leaveTime?: Date;
    networkQuality: Array<{
      timestamp: Date;
      quality: 'excellent' | 'good' | 'poor' | 'bad';
      bandwidth: number;
    }>;
  }>;
  events: ITelemetryEvent[];
  recordingAnalytics?: {
    duration: number;
    storageSize: number;
    accessedCount: number;
  };
}

const ConsultationTelemetrySchema: Schema = new Schema({
  consultation: { type: Schema.Types.ObjectId, ref: 'Consultation', required: true },
  participants: [{
    userId: { type: Schema.Types.ObjectId, required: true },
    role: { type: String, enum: ['doctor', 'patient', 'observer'], required: true },
    joinTime: { type: Date, required: true },
    leaveTime: Date,
    networkQuality: [{
      timestamp: { type: Date, default: Date.now },
      quality: { type: String, enum: ['excellent', 'good', 'poor', 'bad'] },
      bandwidth: Number
    }]
  }],
  events: [{
    timestamp: { type: Date, default: Date.now },
    eventType: { type: String, required: true },
    data: Schema.Types.Mixed
  }],
  recordingAnalytics: {
    duration: Number,
    storageSize: Number,
    accessedCount: { type: Number, default: 0 }
  }
});

export default mongoose.model<IConsultationTelemetry>('ConsultationTelemetry', ConsultationTelemetrySchema);