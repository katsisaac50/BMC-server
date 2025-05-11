"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var WaitingRoomSchema = new mongoose_1.Schema({
    department: { type: String, required: true, enum: ['cardiology', 'pediatrics', 'general'] },
    currentQueue: [{
            patientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Patient', required: true },
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Consultation'
        }],
    onlineDoctors: [{
            doctorId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Staff' },
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
exports.default = mongoose_1.default.model('WaitingRoom', WaitingRoomSchema);
