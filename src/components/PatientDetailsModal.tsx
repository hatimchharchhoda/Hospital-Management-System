/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import DateTreatmentPopup from '@/components/DateTreatmentPopup';
import NewTreatmentPopup from './NewTreatmentPopup';

// Props
interface Props {
  patient: any;
  onClose: () => void;
  onSuccess?: () => void; // optional refresh handler
  fetchPatientRecords: any;
}

 
export default function PatientDetailsModal({ patient, onClose, fetchPatientRecords }: Props) {
  const [addingNew, setAddingNew] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const sortedRecords = [...patient.treatmentRecords].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-10 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Patient Details - {patient.name}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">X</button>
        </div>

        <div className="space-y-4">
          {sortedRecords.map((record, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedDate(record)}
              className="border p-3 rounded hover:bg-gray-100 cursor-pointer"
            >
              <div className="font-bold">{new Date(record.date).toLocaleDateString()}</div>
              <div className="text-sm text-gray-500">
                {record.room?.roomCategory && `Room: ${record.room.roomCategory}, `}
                {record.room?.roomNo && `Room No: ${record.room.roomNo}, `}
                {record.room?.bedNo && `Bed No: ${record.room.bedNo}`}
              </div>
            </div>
          ))}

          <button
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            onClick={() => setAddingNew(true)}
          >
            + New Day Record
          </button>
          {addingNew && (
            <NewTreatmentPopup
              patientId={patient}
              onClose={() => setAddingNew(false)}
              onSuccess={() => {
                setAddingNew(false);
              }}
            />
          )}

        {selectedDate && (
          <DateTreatmentPopup
            patientId={patient._id}
            record={selectedDate}
            onClose={() => setSelectedDate(null)}
            onSuccess={fetchPatientRecords}
          />
        )}
      </div>
    </div>
    </div>
  );
}