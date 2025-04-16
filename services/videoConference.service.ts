import axios from 'axios';
import Consultation from '../models/Consultation';
import logger from '../utils/logger';
import { generateJWT } from '../utils/helpers';

// Using Daily.co as an example video API provider
const DAILY_API_KEY = process.env.DAILY_API_KEY;
const DAILY_API_URL = 'https://api.daily.co/v1';

interface DailyRoom {
  id: string;
  name: string;
  url: string;
  privacy: 'public' | 'private';
  properties: {
    enable_recording?: 'cloud' | 'local';
    enable_chat?: boolean;
    eject_at_room_exp?: boolean;
    exp?: number;
  };
}

export const createVideoRoom = async (consultationId: string): Promise<IConsultation> => {
  const consultation = await Consultation.findById(consultationId)
    .populate('patient', 'name')
    .populate('doctor', 'name');
  
  if (!consultation) {
    throw new Error('Consultation not found');
  }

  // Calculate expiration time (1 hour after scheduled end)
  const expTime = Math.floor((new Date(consultation.scheduledAt).getTime() + 
    (consultation.duration + 60) * 60 * 1000) / 1000);

  try {
    const response = await axios.post<DailyRoom>(
      `${DAILY_API_URL}/rooms`,
      {
        name: `consultation-${consultationId}`,
        privacy: 'private',
        properties: {
          enable_recording: 'cloud',
          enable_chat: true,
          eject_at_room_exp: true,
          exp: expTime
        }
      },
      {
        headers: {
          Authorization: `Bearer ${DAILY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Generate meeting tokens for patient and doctor
    const patientToken = generateJWT({
      roomName: response.data.name,
      userId: `patient-${consultation.patient._id}`,
      userName: consultation.patient.name,
      isOwner: false
    });

    const doctorToken = generateJWT({
      roomName: response.data.name,
      userId: `doctor-${consultation.doctor._id}`,
      userName: consultation.doctor.name,
      isOwner: true
    });

    // Update consultation with meeting details
    consultation.meetingUrl = `${response.data.url}?t=${doctorToken}`;
    consultation.status = 'scheduled';
    await consultation.save();

    return {
      ...consultation.toObject(),
      patientToken: `${response.data.url}?t=${patientToken}`
    };
  } catch (error) {
    logger.error('Failed to create video room:', error);
    throw new Error('Failed to create video consultation room');
  }
};

export const endVideoRoom = async (consultationId: string): Promise<void> => {
  const consultation = await Consultation.findById(consultationId);
  if (!consultation) {
    throw new Error('Consultation not found');
  }

  try {
    const roomName = `consultation-${consultationId}`;
    await axios.delete(`${DAILY_API_URL}/rooms/${roomName}`, {
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`
      }
    });

    consultation.endedAt = new Date();
    consultation.status = 'completed';
    await consultation.save();
  } catch (error) {
    logger.error('Failed to end video room:', error);
    throw new Error('Failed to end video consultation');
  }
};

export const getRoomRecordings = async (consultationId: string): Promise<string[]> => {
  try {
    const roomName = `consultation-${consultationId}`;
    const response = await axios.get(`${DAILY_API_URL}/recordings?room=${roomName}`, {
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`
      }
    });

    return response.data.data.map((rec: any) => rec.url);
  } catch (error) {
    logger.error('Failed to fetch recordings:', error);
    throw new Error('Failed to get consultation recordings');
  }
};