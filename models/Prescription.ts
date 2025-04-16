import mongoose, { Schema, Document } from 'mongoose';

interface IMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface IPrescription extends Document {
  consultation: mongoose.Types.ObjectId;
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  medications: IMedication[];
  date: Date;
  expiry: Date;
  isDigital: boolean;
  isFilled: boolean;
  pharmacyNotes?: string;
  qrCode?: string;
}

const PrescriptionSchema: Schema = new Schema({
  consultation: { type: Schema.Types.ObjectId, ref: 'Consultation', required: true },
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'Staff', required: true },
  medications: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    instructions: String
  }],
  date: { type: Date, default: Date.now },
  expiry: { type: Date, default: () => new Date(Date.now() + 30*24*60*60*1000) }, // 30 days
  isDigital: { type: Boolean, default: true },
  isFilled: { type: Boolean, default: false },
  pharmacyNotes: String,
  qrCode: String
}, {
  timestamps: true
});

// Indexes for fast lookups
PrescriptionSchema.index({ patient: 1, date: -1 });
PrescriptionSchema.index({ doctor: 1, date: -1 });
PrescriptionSchema.index({ consultation: 1 });
PrescriptionSchema.index({ isFilled: 1, expiry: 1 });

export default mongoose.model<IPrescription>('Prescription', PrescriptionSchema);