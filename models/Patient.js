const mongoose = require('mongoose');
const { Schema } = mongoose;

const PatientSchema = new Schema({
  medicalRecordNumber: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date, required: true },
  gender: { 
    type: String, 
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    required: true 
  },
  contactInfo: {
    email: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: { type: String, trim: true },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      country: { type: String, trim: true }
    },
    emergencyContact: {
      name: { type: String, trim: true },
      relationship: { type: String, trim: true },
      phone: { type: String, trim: true }
    }
  },
  medicalHistory: [{
    name: { type: String, required: true, trim: true },
    diagnosedDate: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ['active', 'inactive', 'resolved'],
      default: 'active'
    },
    notes: { type: String, trim: true }
  }],
  allergies: [{ type: String, trim: true }],
  bloodType: { 
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] 
  },
  lastVisitDate: { type: Date },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
PatientSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
PatientSchema.virtual('age').get(function () {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Indexes
PatientSchema.index({ firstName: 'text', lastName: 'text', 'contactInfo.email': 'text' });
PatientSchema.index({ 'contactInfo.phone': 1 });
PatientSchema.index({ isActive: 1 });
PatientSchema.index({ 'medicalHistory.status': 1 });

module.exports = mongoose.model('Patient', PatientSchema);