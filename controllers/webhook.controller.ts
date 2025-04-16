import Consultation from '../models/Consultation';
import asyncHandler from 'express-async-handler';
import logger from '../utils/logger';
import { verifyWebhookSignature } from '../utils/helpers';

export const handleVideoWebhook = asyncHandler(async (req: Request, res: Response) => {
  // Verify webhook signature
  if (!verifyWebhookSignature(req)) {
    return res.status(401).json({ success: false, error: 'Invalid signature' });
  }

  const event = req.body;
  logger.info(`Received video webhook event: ${event.type}`);

  try {
    switch (event.type) {
      case 'room.started':
        await handleRoomStarted(event);
        break;
      case 'room.ended':
        await handleRoomEnded(event);
        break;
      case 'recording.ready':
        await handleRecordingReady(event);
        break;
      case 'participant.joined':
        await handleParticipantJoined(event);
        break;
      case 'participant.left':
        await handleParticipantLeft(event);
        break;
      default:
        logger.debug(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Error handling webhook:', error);
    res.status(500).json({ success: false, error: 'Webhook processing failed' });
  }
});

async function handleRoomStarted(event: any) {
  const roomName = event.room.name;
  const consultationId = roomName.split('-')[1];
  
  await Consultation.findByIdAndUpdate(consultationId, {
    status: 'in-progress',
    startedAt: new Date(event.timestamp * 1000)
  });
}

async function handleRoomEnded(event: any) {
  const roomName = event.room.name;
  const consultationId = roomName.split('-')[1];
  
  await Consultation.findByIdAndUpdate(consultationId, {
    status: 'completed',
    endedAt: new Date(event.timestamp * 1000)
  });
}

async function handleRecordingReady(event: any) {
  const roomName = event.room;
  const consultationId = roomName.split('-')[1];
  
  await Consultation.findByIdAndUpdate(consultationId, {
    $push: { recordings: event.url }
  });
}

async function handleParticipantJoined(event: any) {
  // Track participant join times if needed
}

async function handleParticipantLeft(event: any) {
  // Track participant duration if needed
}