"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ConsultationSchema = new mongoose_1.Schema({
    patient: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Staff', required: true },
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
    prescriptions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Prescription' }],
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
exports.default = mongoose_1.default.model('Consultation', ConsultationSchema);
