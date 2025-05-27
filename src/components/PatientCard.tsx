interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patient: any;
  onClick: () => void;
  onDischarge: (id: string) => void;
}

export default function PatientCard({ patient, onClick, onDischarge }: Props) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer border rounded-xl p-4 shadow hover:bg-gray-50 transition"
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="font-bold text-lg">{patient.patientId}</div>
          <div className="text-gray-600 text-sm">
            {patient.name}, {patient.address && `${patient.address},`} {patient.mobile}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDischarge(patient._id);
          }}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Discharge
        </button>
      </div>
    </div>
  );
}
