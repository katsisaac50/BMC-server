import Joi from 'joi';
import { PatientStatus } from '../types/custom.types';

export const validateRequest = async (req: Request) => {
  const schema = Joi.object({
    days: Joi.number().integer().min(1).max(365).default(7),
    detailed: Joi.boolean().default(false),
    status: Joi.string().valid(...Object.values(PatientStatus)),
    limit: Joi.number().integer().min(1).max(100).default(10),
    page: Joi.number().integer().min(1).default(1)
  });

  await schema.validateAsync(req.query);
};