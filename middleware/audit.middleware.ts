import AuditLog from '../models/AuditLog';
import { AuthenticatedRequest } from '../types/custom.types';

export const auditMiddleware = (action: string, entity: string) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const oldJson = res.json;
    res.json = async (body) => {
      try {
        const logData = {
          action,
          entity,
          entityId: req.params.id || body._id || 'unknown',
          userId: req.user?.id,
          userRole: req.user?.role,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          status: res.statusCode < 400 ? 'success' : 'failed',
          beforeState: req.body._original, // You'd need to store this earlier
          afterState: body.data || body
        };

        await AuditLog.create(logData);
      } catch (error) {
        console.error('Audit logging failed:', error);
      }
      return oldJson.call(res, body);
    };
    next();
  };
};