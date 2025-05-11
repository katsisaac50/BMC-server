"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var AuditLogSchema = new mongoose_1.Schema({
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String, required: true },
    userId: { type: String },
    userRole: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    beforeState: { type: mongoose_1.Schema.Types.Mixed },
    afterState: { type: mongoose_1.Schema.Types.Mixed },
    status: { type: String, enum: ['success', 'failed'], required: true },
    timestamp: { type: Date, default: Date.now }
}, {
    timestamps: false
});
// Indexes for faster querying
AuditLogSchema.index({ entity: 1, entityId: 1 });
AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ userId: 1 });
AuditLogSchema.index({ timestamp: -1 });
exports.default = mongoose_1.default.model('AuditLog', AuditLogSchema);
