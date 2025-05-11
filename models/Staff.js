const mongoose = require('mongoose');
const { Schema } = mongoose;

const StaffSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { 
    type: String, 
    required: true,
    enum: ['doctor', 'nurse', 'admin', 'staff']
  },
  department: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Staff', StaffSchema);