import Patient from '../models/Patient';
import { IPatient, IMedicalCondition } from '../types/patient.types';
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import logger from '../utils/logger';
import { generateMedicalRecordNumber } from '../utils/helpers';

export const getAllPatients = async (
  filter: FilterQuery<IPatient> = {},
  options: QueryOptions = {}
) => {
  try {
    const defaultOptions = {
      sort: { lastName: 1, firstName: 1 },
      lean: true,
      ...options
    };

    return await Patient.find(filter, null, defaultOptions);
  } catch (error) {
    logger.error('Error fetching patients:', error);
    throw new Error('Failed to fetch patients');
  }
};

export const getPatientById = async (id: string) => {
  try {
    return await Patient.findById(id).lean();
  } catch (error) {
    logger.error(`Error fetching patient with ID ${id}:`, error);
    throw new Error('Failed to fetch patient');
  }
};

export const createPatient = async (patientData: Partial<IPatient>) => {
  try {
    const medicalRecordNumber = await generateMedicalRecordNumber();
    const newPatient = await Patient.create({
      ...patientData,
      medicalRecordNumber
    });
    return newPatient.toObject();
  } catch (error) {
    logger.error('Error creating patient:', error);
    throw new Error('Failed to create patient');
  }
};

export const updatePatient = async (
  id: string,
  updates: UpdateQuery<IPatient>,
  options: QueryOptions = { new: true, runValidators: true }
) => {
  try {
    return await Patient.findByIdAndUpdate(id, updates, options).lean();
  } catch (error) {
    logger.error(`Error updating patient with ID ${id}:`, error);
    throw new Error('Failed to update patient');
  }
};

export const deletePatient = async (id: string) => {
  try {
    return await Patient.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).lean();
  } catch (error) {
    logger.error(`Error deleting patient with ID ${id}:`, error);
    throw new Error('Failed to delete patient');
  }
};

export const addMedicalCondition = async (
  patientId: string,
  condition: IMedicalCondition
) => {
  try {
    return await Patient.findByIdAndUpdate(
      patientId,
      { $push: { medicalHistory: condition } },
      { new: true, runValidators: true }
    ).lean();
  } catch (error) {
    logger.error(`Error adding medical condition to patient ${patientId}:`, error);
    throw new Error('Failed to add medical condition');
  }
};

export const searchPatients = async (query: string, limit = 10) => {
  try {
    return await Patient.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit)
    .lean();
  } catch (error) {
    logger.error(`Error searching patients with query ${query}:`, error);
    throw new Error('Failed to search patients');
  }
};



// import Patient from '../models/Patient';
// import { escapeRegExp } from '../utils/helpers';

// export const searchPatients = async (
//   query: string,
//   filters: Record<string, any> = {},
//   options: { limit?: number; page?: number } = {}
// ) => {
//   const { limit = 10, page = 1 } = options;
//   const skip = (page - 1) * limit;

//   const searchQuery = {
//     $and: [
//       { isActive: true },
//       filters,
//       {
//         $or: [
//           { name: { $regex: escapeRegExp(query), $options: 'i' } },
//           { email: { $regex: escapeRegExp(query), $options: 'i' } },
//           { phone: { $regex: escapeRegExp(query), $options: 'i' } },
//           { 'address.text': { $regex: escapeRegExp(query), $options: 'i' } }
//         ]
//       }
//     ]
//   };

//   const [patients, total] = await Promise.all([
//     Patient.find(searchQuery)
//       .skip(skip)
//       .limit(limit)
//       .sort({ lastName: 1, firstName: 1 }),
//     Patient.countDocuments(searchQuery)
//   ]);

//   return {
//     patients,
//     total,
//     pages: Math.ceil(total / limit),
//     currentPage: page
//   };
// };

// // Fuzzy search with Atlas Search (if using MongoDB Atlas)
// export const fuzzySearchPatients = async (query: string) => {
//   return await Patient.aggregate([
//     {
//       $search: {
//         index: 'patient_search',
//         compound: {
//           should: [
//             {
//               autocomplete: {
//                 query: query,
//                 path: 'name',
//                 fuzzy: { maxEdits: 1 }
//               }
//             },
//             {
//               text: {
//                 query: query,
//                 path: ['email', 'phone', 'medicalRecordNumber'],
//                 score: { boost: { value: 2 } }
//               }
//             }
//           ]
//         }
//       }
//     },
//     { $limit: 10 },
//     { $project: { _id: 1, name: 1, email: 1, phone: 1, lastVisit: 1 } }
//   ]);
// };