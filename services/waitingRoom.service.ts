import WaitingRoom from '../models/WaitingRoom';
import Consultation from '../models/Consultation';
import { calculateWaitTimes } from '../utils/queueHelpers';

export const joinWaitingRoom = async (patientId: string, department: string, priority = 'medium') => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Find or create waiting room for department
    const waitingRoom = await WaitingRoom.findOneAndUpdate(
      { department },
      { $push: { 
        currentQueue: { 
          patientId, 
          priority,
          estimatedWaitTime: await calculateWaitTimes(department)
        } 
      }},
      { upsert: true, new: true, session }
    ).populate('currentQueue.patientId', 'name');
    
    // Create preliminary consultation record
    const consultation = await Consultation.create([{
      patient: patientId,
      consultationType: 'video',
      status: 'scheduled',
      department
    }], { session });
    
    await session.commitTransaction();
    
    return {
      waitingRoom,
      position: waitingRoom.currentQueue.length,
      estimatedWait: waitingRoom.currentQueue.slice(-1)[0].estimatedWaitTime
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const assignDoctorToPatient = async (department: string) => {
  const waitingRoom = await WaitingRoom.findOne({ department })
    .populate('currentQueue.patientId')
    .populate('onlineDoctors.doctorId');
  
  if (!waitingRoom) throw new Error('No waiting room found');

  // Find highest priority patient
  const nextPatient = waitingRoom.currentQueue
    .filter(p => p.status === 'waiting')
    .sort((a, b) => {
      const priorityOrder = { emergency: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority] || 
             a.joinedAt - b.joinedAt;
    })[0];

  if (!nextPatient) return null;

  // Find available doctor
  const availableDoctor = waitingRoom.onlineDoctors
    .find(d => d.available && d.lastPing > new Date(Date.now() - 30000));

  if (!availableDoctor) return null;

  // Update records
  nextPatient.status = 'in-consultation';
  availableDoctor.available = false;
  
  await waitingRoom.save();
  
  return {
    patient: nextPatient.patientId,
    doctor: availableDoctor.doctorId,
    position: waitingRoom.currentQueue.indexOf(nextPatient) + 1
  };
};