import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  entity: string;
  entityId: string;
  userId?: string;
  userRole?: string;
  ipAddress?: string;
  userAgent?: string;
  beforeState?: any;
  afterState?: any;
  status: 'success' | 'failed';
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema({
  action: { type: String, required: true },
  entity: { type: String, required: true },
  entityId: { type: String, required: true },
  userId: { type: String },
  userRole: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String },
  beforeState: { type: Schema.Types.Mixed },
  afterState: { type: Schema.Types.Mixed },
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

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);