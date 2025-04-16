import mongoose, { Schema, Document } from 'mongoose';

interface IWaitingPatient {
  patientId: mongoose.Types.ObjectId;
  joinedAt: Date;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'waiting' | 'in-consultation' | 'completed' | 'cancelled';
  estimatedWaitTime?: number; // in minutes
}

const WaitingRoomSchema: Schema = new Schema({
  department: { type: String, required: true, enum: ['cardiology', 'pediatrics', 'general'] },
  currentQueue: [{
    patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    joinedAt: { type: Date, default: Date.now },
    priority: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'emergency'],
      default: 'medium'
    },
    status: {
      type: String,
      enum: ['waiting', 'in-consultation', 'completed', 'cancelled'],
      default: 'waiting'
    },
    estimatedWaitTime: Number
  }],
  activeConsultations: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Consultation' 
  }],
  onlineDoctors: [{
    doctorId: { type: Schema.Types.ObjectId, ref: 'Staff' },
    available: { type: Boolean, default: true },
    lastPing: { type: Date }
  }]
}, {
  timestamps: true
});

// Add index for faster queue lookups
WaitingRoomSchema.index({ 
  department: 1, 
  'currentQueue.status': 1, 
  'currentQueue.priority': 1 
});

export default mongoose.model('WaitingRoom', WaitingRoomSchema);