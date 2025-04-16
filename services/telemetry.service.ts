import ConsultationTelemetry from '../models/ConsultationTelemetry';

export const logConsultationEvent = async (
  consultationId: string,
  eventType: string,
  data: any,
  userId?: string,
  userRole?: string
) => {
  const update: any = {
    $push: { events: { eventType, data } }
  };

  if (userId && userRole) {
    update.$push = {
      ...update.$push,
      participants: {
        userId,
        role: userRole,
        joinTime: new Date()
      }
    };
  }

  await ConsultationTelemetry.findOneAndUpdate(
    { consultation: consultationId },
    update,
    { upsert: true, new: true }
  );
};

export const getConsultationQualityMetrics = async (consultationId: string) => {
  return await ConsultationTelemetry.aggregate([
    { $match: { consultation: new mongoose.Types.ObjectId(consultationId) } },
    { $unwind: '$participants' },
    {
      $group: {
        _id: '$participants.role',
        avgBandwidth: { $avg: '$participants.networkQuality.bandwidth' },
        poorQualityPercentage: {
          $avg: {
            $cond: [
              { $in: ['$participants.networkQuality.quality', ['poor', 'bad']] },
              1, 0
            ]
          }
        },
        duration: {
          $avg: {
            $subtract: [
              '$participants.leaveTime',
              '$participants.joinTime'
            ]
          }
        }
      }
    }
  ]);
};