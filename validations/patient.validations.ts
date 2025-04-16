import Joi from 'joi';
import { NextFunction, Request, Response } from 'express';

const basePatientSchema = Joi.object({
  firstName: Joi.string().required().max(50),
  lastName: Joi.string().required().max(50),
  dateOfBirth: Joi.date().required().max('now'),
  gender: Joi.string().valid('Male', 'Female', 'Other', 'Prefer not to say').required(),
  contactInfo: Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      postalCode: Joi.string(),
      country: Joi.string()
    }),
    emergencyContact: Joi.object({
      name: Joi.string().required(),
      relationship: Joi.string().required(),
      phone: Joi.string().pattern(/^[0-9]{10,15}$/).required()
    })
  }).required(),
  bloodType: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
  allergies: Joi.array().items(Joi.string())
});

export const validatePatientCreation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await basePatientSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const errors = error.details.map((detail: any) => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
};

export const validatePatientUpdate = async (req: Request, res: Response, next: NextFunction) => {
  const schema = basePatientSchema.fork(
    ['firstName', 'lastName', 'dateOfBirth', 'gender', 'contactInfo.email'], 
    field => field.optional()
  );
  
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const errors = error.details.map((detail: any) => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
};