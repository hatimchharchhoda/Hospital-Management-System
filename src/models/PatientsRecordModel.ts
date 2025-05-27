import mongoose, { Schema, Document } from 'mongoose';

export interface AdmissionSummary {
  dateOfAdmission: Date;
  dateOfDischarge?: Date;
  assignedDoctorName?: string | null; // Moved here
  doctorFees: number;
  bottleCost: number;
  roomCost: number;
  medicineCost: number;
  operationCost: number;
  otherCharges: number;
  totalBill: number;
}

export interface PatientSummaryType extends Document {
  patientId: string;
  hospitalId: mongoose.Schema.Types.ObjectId;
  name: string;
  address: string;
  mobile: string;
  admissions: AdmissionSummary[];
}

const AdmissionSummarySchema = new Schema<AdmissionSummary>({
  dateOfAdmission: { type: Date, required: true },
  dateOfDischarge: { type: Date, default: null },
  assignedDoctorName: { type: String, default: null }, // Added here
  doctorFees: { type: Number, default: 0 },
  bottleCost: { type: Number, default: 0 },
  roomCost: { type: Number, default: 0 },
  medicineCost: { type: Number, default: 0 },
  operationCost: { type: Number, default: 0 },
  otherCharges: { type: Number, default: 0 },
  totalBill: { type: Number, default: 0 },
});

const PatientSummarySchema = new Schema<PatientSummaryType>({
  patientId: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, default: '' },
  mobile: { type: String, required: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  admissions: { type: [AdmissionSummarySchema], default: [] },
});

const PatientsRecordModel =
  (mongoose.models.PatientSummary as mongoose.Model<PatientSummaryType>) ||
  mongoose.model<PatientSummaryType>('PatientSummary', PatientSummarySchema);

export default PatientsRecordModel;