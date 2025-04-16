import { Document } from 'mongoose';

export type Gender = 'male' | 'female' | 'other';
export type PatientStatus = 'active' | 'inactive' | 'follow_up' | 'discharged';
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';
export type AlertType = 'system' | 'patient' | 'staff' | 'appointment' | 'medical';

export interface IDashboardStats {
  totalPatients: number;
  activeCases: number;
  appointmentsToday: number;
  unreadAlerts: number;
  availableStaff: number;
  alertStats?: Array<{
    priority: AlertPriority;
    count: number;
    unread: number;
  }>;
}

export interface IPatient extends Document {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  bloodType?: string;
  lastVisit: Date;
  status: PatientStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPatientWithDetails extends IPatient {
  appointmentCount: number;
  lastAppointment?: IAppointment;
}

export interface IAlert extends Document {
  type: AlertType;
  message: string;
  priority: AlertPriority;
  isRead: boolean;
  relatedPatient?: mongoose.Types.ObjectId;
  relatedStaff?: mongoose.Types.ObjectId;
  metadata?: any;
}

export interface IUser extends Document {
  id: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}