import { Medicine } from './treatment';

export type TreatmentRecord = {
  treatment_for: string;
  date: string;
  room?: {
    roomNo?: string;
    bedNo?: string;
    roomCategory?: 'general' | 'semi-private' | 'private' | 'ICU' | 'null';
    roomPrice?: number;
  };
  bottles?: {
    count: number;
    price: number;
  };
  injections?: {
    count: number;
    price: number;
  };
  doctorFees: number;
  operationCost?: number;
  otherCost?: number;
  medicines: Medicine[];
};

export type Patient = {
  _id: string;
  patientId: string;
  name: string;
  address?: string;
  mobile: string;
  status: string;
  assignedDoctorName?: string;
  treatmentRecords: TreatmentRecord[];
};