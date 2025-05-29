import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FormProps = {
  mode: 'create' | 'update';
  defaultValues?: {
    appointmentId?: string;
    patientName?: string;
    address?: string;
    mobile?: string;
    appointmentDate: string;
    appointmentTime: string;
  };
  onSuccess: () => void;
};

export const AppointmentForm = ({ mode, defaultValues, onSuccess }: FormProps) => {
  const [form, setForm] = useState({
    patientName: defaultValues?.patientName || '',
    address: defaultValues?.address || '',
    mobile: defaultValues?.mobile || '',
    appointmentDate: defaultValues?.appointmentDate || '',
    appointmentTime: defaultValues?.appointmentTime || '',
  });
  const [loading, setLoading] = useState(false);
  const isUpdate = mode === 'update';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const url = isUpdate ? '/api/appointment/update' : '/api/appointment/create-new';
    const method = isUpdate ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        isUpdate
          ? {
              appointmentId: defaultValues?.appointmentId,
              newDate: form.appointmentDate,
              newTime: form.appointmentTime,
            }
          : form
      ),
    });

    const result = await res.json();
    setLoading(false);

    if (result.success) {
      onSuccess();
    } else {
      alert(result.message || 'Something went wrong');
    }
  };

  return (
    <div className="space-y-4">
      {!isUpdate && (
        <>
          <div>
            <Label>Name</Label>
            <Input name="patientName" value={form.patientName} onChange={handleChange} />
          </div>
          <div>
            <Label>Address</Label>
            <Input name="address" value={form.address} onChange={handleChange} />
          </div>
          <div>
            <Label>Mobile</Label>
            <Input name="mobile" value={form.mobile} onChange={handleChange} />
          </div>
        </>
      )}

      <div>
        <Label>Date</Label>
        <Input type="date" name="appointmentDate" value={form.appointmentDate} onChange={handleChange} />
      </div>

      <div>
        <Label>Time</Label>
        <Input type="time" name="appointmentTime" value={form.appointmentTime} onChange={handleChange} />
      </div>

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Submitting...' : isUpdate ? 'Update Appointment' : 'Create Appointment'}
      </Button>
    </div>
  );
};