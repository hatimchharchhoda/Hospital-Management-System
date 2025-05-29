'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface Appointment {
  _id: string;
  patientName: string;
  address: string;
  mobile: string;
  appointmentTime: string;
  appointmentDate: string;
}

export default function HomePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      const today = new Date();
      const dateStr = format(today, 'yyyy-MM-dd');

      const res = await fetch('/api/appointment/fetch', {
        method: 'POST',
        body: JSON.stringify({ date: dateStr }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
      }
    };

    fetchAppointments();
  }, []);

  const handleConvertToAdmission = async (appointment: Appointment) => {
    // Call delete appointment API
    await fetch('/api/appointment/delete', {
      method: 'DELETE',
      body: JSON.stringify({ appointmentId: appointment._id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Redirect to admission form with query params or route state
    router.push(
      `/Admission?name=${encodeURIComponent(appointment.patientName)}&mobile=${appointment.mobile}&address=${encodeURIComponent(appointment.address)}`
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Today&apos;s Appointments</h1>
      {appointments.length === 0 ? (
        <p className="text-gray-500">No appointments today.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="flex justify-between items-center border p-4 rounded-lg shadow-sm"
            >
              <div className="text-lg font-medium text-blue-600">
                {appt.appointmentTime}
              </div>

              <div className="flex-1 ml-4">
                <div className="font-bold text-gray-800">{appt.patientName}</div>
                <div className="text-sm text-gray-600">{appt.mobile}</div>
                {appt.address && (
                  <div className="text-sm text-gray-500">{appt.address}</div>
                )}
              </div>

              <Button onClick={() => handleConvertToAdmission(appt)}>
                Convert to Admission
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}