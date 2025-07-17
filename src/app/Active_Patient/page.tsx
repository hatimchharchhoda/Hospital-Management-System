'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import PatientCard from '@/components/PatientCard';
import PatientDetailsModal from '@/components/PatientDetailsModal';
import { Patient } from '@/types/patients';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

export default function ActivePatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchPatients = async () => {
    try {
      const res = await axios.get('/api/get-active-patients');
      setPatients(res.data.patients);
    } catch (error) {
      toast({
          title: "Error",
          description: "Error fetching patients",
          variant: "destructive",
        });
      console.error('Error fetching patients', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDischarge = async (patientId: string) => {
    try {
      const res = await axios.post('/api/discharge-patient', { patientId });
      fetchPatients();
       router.push('/History');
    } catch (err) {
      toast({
          title: "Error",
          description: "Error discharge patient",
          variant: "destructive",
        });
      console.error('Discharge error:', err);
    }
  };

  const skeletonCards = Array.from({ length: 6 }).map((_, i) => (
    <div
      key={i}
      className="p-4 bg-white rounded-2xl shadow-sm space-y-3 animate-pulse"
    >
      <Skeleton className="h-5 w-32 bg-[#D8ECF7]" />
      <Skeleton className="h-4 w-48 bg-[#D8ECF7]" />
      <Skeleton className="h-4 w-40 bg-[#D8ECF7]" />
      <Skeleton className="h-8 w-24 mt-2 bg-[#B3E5FC] rounded-md" />
    </div>
  ));

  return (
    <div className="p-4 md:p-6 min-h-screen bg-[#F5F9FF]">
      <h1 className="text-2xl font-semibold text-[#2E86AB] mb-6">Active Patients</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skeletonCards}
        </div>
      ) : patients.length === 0 ? (
        <p className="text-base text-muted-foreground">No active patients found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map((patient) => (
            <PatientCard
              key={patient._id}
              patient={patient}
              onClick={() => setSelectedPatient(patient)}
              onDischarge={handleDischarge}
            />
          ))}
        </div>
      )}

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