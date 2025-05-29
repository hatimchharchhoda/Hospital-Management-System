import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

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
      toast({
        title: "Success",
        description: result.message || "Successfully Changed",
      });
      onSuccess();
    } else {
      toast({
        title: "Error",
        description: result.message || "Error while changing",
      });
    }
  };

  return (
    <Card className="bg-[#F5F9FF] border border-[#E0EAF4] rounded-2xl shadow-md">
      <CardContent className="space-y-4 p-6">
        {!isUpdate && (
          <>
            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Name</Label>
              <Input
                name="patientName"
                value={form.patientName}
                onChange={handleChange}
                placeholder="Enter patient name"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Address</Label>
              <Input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter address"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm text-muted-foreground">Mobile</Label>
              <Input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
              />
            </div>
          </>
        )}

        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">Date</Label>
          <Input
            type="date"
            name="appointmentDate"
            value={form.appointmentDate}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">Time</Label>
          <Input
            type="time"
            name="appointmentTime"
            value={form.appointmentTime}
            onChange={handleChange}
          />
        </div>

        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full transition-all bg-[#2E86AB] hover:bg-[#76C7C0] text-white"
          >
            {loading
              ? 'Submitting...'
              : isUpdate
              ? 'Update Appointment'
              : 'Create Appointment'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};