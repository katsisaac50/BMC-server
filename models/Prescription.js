"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var PrescriptionSchema = new mongoose_1.Schema({
    consultation: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Consultation', required: true },
    patient: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Staff', required: true },
    medications: [{
            name: { type: String, required: true },
            dosage: { type: String, required: true },
            frequency: { type: String, required: true },
            duration: { type: String, required: true },
            instructions: String
        }],
    date: { type: Date, default: Date.now },
    expiry: { type: Date, default: function () { return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); } }, // 30 days
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
exports.default = mongoose_1.default.model('Prescription', PrescriptionSchema);
