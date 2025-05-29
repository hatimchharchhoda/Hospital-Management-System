interface Room {
  roomNo: string;
  bedNo: string;
  roomCategory: string;
  roomPrice: string;
}

interface BottlesOrInjections {
  count: string;
  price: string;
}

export interface Medicine {
  name: string;
  quantity: string;
  price: string;
}

export interface PatientFormData {
  patientId: string;
  assignedDoctorName: string;
  name: string;
  mobile: string;
  address: string;
  treatmentFor: string;
  date: string;
  room: Room;
  bottles: BottlesOrInjections;
  injections: BottlesOrInjections;
  doctorFees: string;
  operationCost: string;
  otherCost: string;
  medicines: Medicine[];
}