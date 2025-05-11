const mongoose = require('mongoose');
const { Schema } = mongoose;
const { AlertPriority, AlertType } = require('../types/custom.types');

const AlertSchema = new Schema({
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

// Type definition (for documentation purposes)
/**
 * @typedef {Object} IAlert
 * @property {AlertType} type
 * @property {string} message
 * @property {AlertPriority} priority
 * @property {boolean} isRead
 * @property {mongoose.Types.ObjectId} [relatedPatient]
 * @property {mongoose.Types.ObjectId} [relatedStaff]
 * @property {*} [metadata]
 */

module.exports = mongoose.model('Alert', AlertSchema);