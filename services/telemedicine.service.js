const { v4: uuidv4 } = require('uuid');
const WebRTC = require('webrtc');
const { SyncService } = require('./ai/sync.service');

class TelemedicineService {
  constructor() {
    this.sessions = new Map();
    this.syncService = new SyncService();
  }

  createSession(doctorId, patientId) {
    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      doctorId,
      patientId,
      startTime: new Date(),
      endTime: null,
      recordingUrl: null,
      status: 'active'
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  endSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.endTime = new Date();
      session.status = 'completed';
      this.syncService.addOperation({
        type: 'SESSION_RECORDING',
        data: session
      });
    }
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }
}

module.exports = TelemedicineService;
