'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import PatientCard from '@/components/PatientCard';
import PatientDetailsModal from '@/components/PatientDetailsModal';
import { Patient } from '@/types/patients';

export default function ActivePatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
   const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const fetchPatients = async () => {
    try {
      const res = await axios.get('/api/get-active-patients');
      setPatients(res.data.patients);
    } catch (error) {
      console.error('Error fetching patients', error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDischarge = async (patientId: string) => {
    try {
      await axios.post('/api/discharge-patient', { patientId });
      fetchPatients();
    } catch (err) {
      console.error('Discharge error:', err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Active Patients</h1>
      <div className="grid gap-4">
        {patients.map((patient) => (
          <PatientCard
            key={patient._id}
            patient={patient}
            onClick={() => setSelectedPatient(patient)}
            onDischarge={handleDischarge}
          />
        ))}
      </div>

      {selectedPatient && (
        <PatientDetailsModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          fetchPatientRecords={fetchPatients}
          
        />
      )}
    </div>
  );
}