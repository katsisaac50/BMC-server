import { Patient } from '../models/Patient';
import { Appointment } from '../models/Appointment';
import { FHIRPatient, FHIRAppointment } from '../types/fhir.types';
import axios from 'axios';
import logger from '../utils/logger';

export const syncPatientToFHIR = async (patientId: string) => {
  const patient = await Patient.findById(patientId).lean();
  if (!patient) throw new Error('Patient not found');

  const fhirPatient: FHIRPatient = {
    resourceType: 'Patient',
    id: patient._id.toString(),
    identifier: [
      {
        system: 'http://hospital.systems/patient',
        value: patient.medicalRecordNumber || patient._id.toString()
      }
    ],
    name: [
      {
        use: 'official',
        family: patient.name.split(' ').slice(-1)[0],
        given: patient.name.split(' ').slice(0, -1)
      }
    ],
    gender: patient.gender,
    birthDate: patient.dateOfBirth?.toISOString().split('T')[0],
    telecom: [
      { system: 'phone', value: patient.phone, use: 'home' },
      { system: 'email', value: patient.email, use: 'home' }
    ],
    address: patient.address ? [
      {
        use: 'home',
        line: [patient.address.street],
        city: patient.address.city,
        state: patient.address.state,
        postalCode: patient.address.postalCode,
        country: patient.address.country
      }
    ] : undefined
  };

  try {
    const fhirServerUrl = process.env.FHIR_SERVER_URL + '/Patient';
    const response = await axios.put(
      `${fhirServerUrl}/${fhirPatient.id}`,
      fhirPatient,
      {
        headers: {
          'Content-Type': 'application/fhir+json'
        }
      }
    );

    return response.data;
  } catch (error) {
    logger.error('FHIR sync failed:', error);
    throw new Error('Failed to sync patient with FHIR server');
  }
};

export const convertAppointmentToFHIR = (appointment: any): FHIRAppointment => {
  return {
    resourceType: 'Appointment',
    id: appointment._id.toString(),
    status: mapAppointmentStatus(appointment.status),
    serviceType: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/service-type',
            code: appointment.serviceType
          }
        ],
        text: appointment.reason
      }
    ],
    start: appointment.startTime.toISOString(),
    end: appointment.endTime.toISOString(),
    participant: [
      {
        actor: {
          reference: `Practitioner/${appointment.doctorId}`
        },
        status: 'accepted'
      },
      {
        actor: {
          reference: `Patient/${appointment.patientId}`
        },
        status: 'accepted'
      }
    ]
  };
};