import mongoose, { Schema, Document } from 'mongoose';

export interface PatientType extends Document {
  patientId: string;
  status: string;
  dateOfAdmission: Date;
  assignedDoctorName?: string | null;
  name: string;
  address: string;
  mobile: string;
  hospitalId: mongoose.Schema.Types.ObjectId;
  treatmentRecords: TreatmentRecordType[];
}

export interface TreatmentRecordType {
  date: Date;
  room?: {
    roomNo?: string;
    bedNo?: string;
    roomCategory?: 'general' | 'semi-private' | 'private' | 'ICU';
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
  doctorFees?: number;
  operationCost?: number;
  otherCost?: number;
  medicines: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

// Function to generate ID in format: PAT-YYYYMMDD-HHMMSS
function generatePatientId(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  return `PAT-${year}${month}${day}-${hours}${minutes}${seconds}`;
}

const PatientSchema: Schema<PatientType> = new mongoose.Schema({
  patientId: {
    type: String,
    unique: true,
    default: generatePatientId,
  },
  status: {
    type: String,
    default: 'pending',
  },
  dateOfAdmission: {
    type: Date,
    default: Date.now,
  },
  assignedDoctorName: {
    type: String,
    default: null,
  },

  // ✅ Newly added fields for patient info
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: '',
  },
  mobile: {
    type: String,
    required: true,
  },

  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  treatmentRecords: [
    {
      treatment_for: { type: String, required: true },
      date: { type: Date, required: true },
      room: {
        roomNo: { type: String, default: null },
        bedNo: { type: String, default: null },
        roomCategory: {
          type: String,
          enum: ['general', 'semi-private', 'private', 'null', 'ICU'],
          default: 'null',
        },
        roomPrice: { type: Number, default: 0 },
      },
      bottles: {
        count: { type: Number, default: null },
        price: { type: Number, default: null },
      },
      injections: {
        count: { type: Number, default: null },
        price: { type: Number, default: null },
      },
      doctorFees: { type: Number, required: true },
      operationCost: { type: Number, default: 0 },
      otherCost: { type: Number, default: 0 },
      medicines: {
        type: [
          {
            name: { type: String, default: null },
            quantity: { type: Number, default: null },
            price: { type: Number, default: null },
          },
        ],
        default: [],
      },
    },
  ],
});

const PendingPatientsModel =
  (mongoose.models.Patient as mongoose.Model<PatientType>) ||
  mongoose.model<PatientType>('Patient', PatientSchema);

export default PendingPatientsModel;