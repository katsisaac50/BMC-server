import mongoose, { Schema, Document } from 'mongoose';
import { AlertPriority, AlertType } from '../types/custom.types';

export interface IAlert extends Document {
  type: AlertType;
  message: string;
  priority: AlertPriority;
  isRead: boolean;
  relatedPatient?: mongoose.Types.ObjectId;
  relatedStaff?: mongoose.Types.ObjectId;
  metadata?: any;
}

const AlertSchema: Schema = new Schema({
  type: { 
    type: String, 
    required: true,
    enum: ['system', 'patient', 'staff', 'appointment', 'medical']
  },
  message: { type: String, required: true },
  priority: { 
    type: String, 
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  isRead: { type: Boolean, default: false },
  relatedPatient: { type: Schema.Types.ObjectId, ref: 'Patient' },
  relatedStaff: { type: Schema.Types.ObjectId, ref: 'Staff' },
  metadata: { type: Schema.Types.Mixed }
}, {
  timestamps: true
});

// Indexes
AlertSchema.index({ priority: 1, isRead: 1 });
AlertSchema.index({ createdAt: -1 });
AlertSchema.index({ relatedPatient: 1 });
AlertSchema.index({ relatedStaff: 1 });

export default mongoose.model<IAlert>('Alert', AlertSchema);