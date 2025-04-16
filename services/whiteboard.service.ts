import axios from 'axios';
import Consultation from '../models/Consultation';
import { generateJWT } from '../utils/helpers';

// Using Excalidraw's API as an example
const WHITEBOARD_API_URL = 'https://excalidraw.com/api/v2';

export const createWhiteboardSession = async (consultationId: string) => {
  const consultation = await Consultation.findById(consultationId);
  if (!consultation) throw new Error('Consultation not found');

  const response = await axios.post(`${WHITEBOARD_API_URL}/rooms`, {
    roomId: `consultation-${consultationId}`,
    persist: true,
    encryptionKey: process.env.WHITEBOARD_ENCRYPTION_KEY
  });

  return {
    whiteboardUrl: `${response.data.url}?token=${generateWhiteboardToken(consultationId)}`,
    roomId: response.data.roomId
  };
};

const generateWhiteboardToken = (consultationId: string) => {
  return generateJWT({
    roomId: `consultation-${consultationId}`,
    permissions: {
      draw: true,
      edit: true,
      export: true
    },
    expiresIn: '6h'
  });
};

export const saveWhiteboardSnapshot = async (consultationId: string, imageData: string) => {
  await Consultation.findByIdAndUpdate(consultationId, {
    $push: {
      whiteboardSnapshots: {
        timestamp: new Date(),
        imageData
      }
    }
  });
};