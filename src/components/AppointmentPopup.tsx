import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AppointmentCard } from '@/components/AppointmentCard';
import { AppointmentForm } from '@/components/AppointmentForm';

type Appointment = {
  _id: string;
  patientName: string;
  address: string;
  mobile: string;
  appointmentDate: string;
  appointmentTime: string;
};

export const AppointmentPopup = ({
  date,
  onClose,
  onRefreshCalendar,
}: {
  date: string;
  onClose: () => void;
  onRefreshCalendar: () => void;
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [mode, setMode] = useState<'create' | 'update' | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const fetchAppointments = async () => {
    const res = await fetch('/api/appointment/fetch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date }),
    });

    const data = await res.json();
    setAppointments(data.appointments);
  };

  useEffect(() => {
    fetchAppointments();
  }, [date]);

  const handleSuccess = async () => {
    setMode(null);
    setSelectedAppointment(null);
    await fetchAppointments();
    onRefreshCalendar();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#F5F9FF] rounded-2xl shadow-lg p-6"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#2E86AB]">
            Appointments for {date}
          </DialogTitle>
        </DialogHeader>

        {mode ? (
          <AppointmentForm
            mode={mode}
            defaultValues={
              mode === 'update' && selectedAppointment
                ? {
                    appointmentId: selectedAppointment?._id,
                    appointmentDate: date,
                    appointmentTime: selectedAppointment?.appointmentTime,
                  }
                : { appointmentDate: date, appointmentTime: '' }
            }
            onSuccess={handleSuccess}
          />
        ) : (
          <>
            <Button
              className="my-4 bg-[#2E86AB] hover:bg-[#76C7C0] transition text-white w-full rounded-xl"
              onClick={() => setMode('create')}
            >
              + New Appointment
            </Button>

            <div className="space-y-3">
              {appointments.map((appt) => (
                <AppointmentCard
                  key={appt._id}
                  appointment={{
                    _id: appt._id,
                    name: appt.patientName,
                    mobile: appt.mobile,
                    time: appt.appointmentTime,
                  }}
                  onEdit={() => {
                    setMode('update');
                    setSelectedAppointment(appt);
                  }}
                  onDelete={async () => {
                    await fetch(`/api/appointment/delete`, {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ appointmentId: appt._id }),
                    });
                    await fetchAppointments();
                    onRefreshCalendar();
                  }}
                />
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};