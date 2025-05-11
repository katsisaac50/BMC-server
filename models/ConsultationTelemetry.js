"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ConsultationTelemetrySchema = new mongoose_1.Schema({
    consultation: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Consultation', required: true },
    participants: [{
            userId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
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
            data: mongoose_1.Schema.Types.Mixed
        }],
    recordingAnalytics: {
        duration: Number,
        storageSize: Number,
        accessedCount: { type: Number, default: 0 }
    }
});
exports.default = mongoose_1.default.model('ConsultationTelemetry', ConsultationTelemetrySchema);
