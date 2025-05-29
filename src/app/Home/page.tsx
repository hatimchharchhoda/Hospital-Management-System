'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      const today = new Date();
      const dateStr = format(today, 'yyyy-MM-dd');

      try {
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
    } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleConvertToAdmission = async (appointment: Appointment) => {
    await fetch('/api/appointment/delete', {
      method: 'DELETE',
      body: JSON.stringify({ appointmentId: appointment._id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    router.push(
      `/Admission?name=${encodeURIComponent(appointment.patientName)}&mobile=${appointment.mobile}&address=${encodeURIComponent(appointment.address)}`
    );
  };

  const skeletons = Array.from({ length: 3 }, (_, i) => (
    <div
      key={i}
      className="flex flex-wrap justify-between items-start bg-white p-4 rounded-2xl shadow-md"
    >
      <Skeleton className="h-6 w-20 bg-[#E3F2FD] rounded" />
      <div className="flex-1 ml-4 space-y-2">
        <Skeleton className="h-5 w-40 bg-[#E3F2FD] rounded" />
        <Skeleton className="h-4 w-24 bg-[#E3F2FD] rounded" />
        <Skeleton className="h-4 w-32 bg-[#E3F2FD] rounded" />
      </div>
      <Skeleton className="h-8 w-36 mt-3 md:mt-0 rounded bg-[#D0EAF4]" />
    </div>
  ));

  return (
    <div className="p-4 md:p-6 bg-[#F5F9FF] min-h-screen">
      <h1 className="text-2xl font-semibold text-[#2E86AB] mb-6">
        Today&apos;s Appointments
      </h1>

      { loading ? (
        <div className="space-y-5">{skeletons}</div>
      ) : appointments.length === 0 ? (
        <p className="text-muted-foreground text-base">No appointments today.</p>
      ) : (
        <div className="space-y-5">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="flex flex-wrap justify-between items-start bg-white p-4 rounded-2xl shadow-md transition hover:shadow-lg"
            >
              <div className="text-lg font-semibold text-[#2E86AB] min-w-[80px]">
                {appt.appointmentTime}
              </div>

              <div className="flex-1 ml-4 space-y-1 text-base">
                <div className="font-medium text-[#1C1F26]">
                  {appt.patientName}
                </div>
                <div className="text-sm text-muted-foreground">{appt.mobile}</div>
                {appt.address && (
                  <div className="text-sm text-muted-foreground">{appt.address}</div>
                )}
              </div>

              <Button
                onClick={() => handleConvertToAdmission(appt)}
                className="mt-3 md:mt-0 transition bg-[#2E86AB] text-white hover:bg-[#76C7C0]"
              >
                Convert to Admission
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}