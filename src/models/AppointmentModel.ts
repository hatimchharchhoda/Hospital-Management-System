import mongoose, { Schema, Document } from 'mongoose';

export interface AppointmentType extends Document {
  patientName: string;
  address: string;
  mobile: string;
  hospitalId: mongoose.Schema.Types.ObjectId; // ref to 'User'
  appointmentDate: Date;
  appointmentTime: string; // e.g., "10:30 AM"
}

const AppointmentSchema: Schema<AppointmentType> = new mongoose.Schema({
  patientName: {
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
  appointmentDate: {
    type: Date,
    required: true,
  },
  appointmentTime: {
    type: String,
    required: true,
  },
});

const AppointmentModel =
  (mongoose.models.Appointment as mongoose.Model<AppointmentType>) ||
  mongoose.model<AppointmentType>('Appointment', AppointmentSchema);

export default AppointmentModel;