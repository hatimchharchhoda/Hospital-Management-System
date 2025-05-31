'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';

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

interface Props {
  patientId: string;
  record: Partial<PatientFormData>;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DateTreatmentPopup({ patientId, record, onClose }: Props) {
  const [form, setForm] = useState<Partial<PatientFormData>>({
    treatmentFor: record.treatmentFor ?? '',
    room: {
      roomNo: record.room?.roomNo ?? '',
      bedNo: record.room?.bedNo ?? '',
      roomCategory: record.room?.roomCategory ?? 'null',
      roomPrice: record.room?.roomPrice ?? '',
    },
    bottles: {
      count: record.bottles?.count ?? '',
      price: record.bottles?.price ?? '',
    },
    injections: {
      count: record.injections?.count ?? '',
      price: record.injections?.price ?? '',
    },
    doctorFees: record.doctorFees ?? '',
    operationCost: record.operationCost ?? '',
    otherCost: record.otherCost ?? '',
    medicines: record.medicines?.length
      ? record.medicines.map((med: Medicine) => ({
          name: med.name ?? '',
          quantity: med.quantity ?? '',
          price: med.price ?? '',
        }))
      : [{ name: '', quantity: '', price: '' }],
  });

  const updateRecord = async () => {
    try {
      const res = await axios.put('/api/update-patient-records', {
        patientId,
        date: record.date,
        updatedTreatmentRecord: form,
      });
      toast({
        title: "Success",
        description: res.data.message || "Successfully updated records",
      });
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: "Error while updating records",
      });
      console.error('Update error:', err);
    }
  };

  const updateMedicine = (index: number, field: keyof Medicine, value: string) => {
    const updated = [...(form.medicines ?? [])];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, medicines: updated });
  };

  const addMedicine = () => {
    setForm({
      ...form,
      medicines: [...(form.medicines ?? []), { name: '', quantity: '', price: '' }],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl max-h-[90vh]"
      >
        <ScrollArea className="h-[75vh] pr-2">
          <h3 className="text-2xl font-semibold text-[#2E86AB] mb-6">
            Edit Treatment – {new Date(record.date ?? '').toLocaleDateString()}
          </h3>

          <div className="space-y-4 text-base">
            {/* Doctor Fees */}
            <div>
              <Label>Doctor Fees</Label>
              <Input
                value={form.doctorFees}
                onChange={(e) => setForm({ ...form, doctorFees: e.target.value })}
              />
            </div>

            {/* Room Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Room No</Label>
                <Input
                  value={form.room?.roomNo}
                  onChange={(e) =>
                    setForm({ ...form, room: { ...form.room!, roomNo: e.target.value } })
                  }
                />
              </div>
              <div>
                <Label>Bed No</Label>
                <Input
                  value={form.room?.bedNo}
                  onChange={(e) =>
                    setForm({ ...form, room: { ...form.room!, bedNo: e.target.value } })
                  }
                />
              </div>
              <div>
                <Label>Room Category</Label>
                <select
                  value={form.room?.roomCategory}
                  onChange={(e) =>
                    setForm({ ...form, room: { ...form.room!, roomCategory: e.target.value } })
                  }
                  className="w-full border px-3 py-2 rounded-md"
                >
                  <option defaultValue="null">Select Category</option>
                  <option value="general">General</option>
                  <option value="semi-private">Semi-private</option>
                  <option value="private">Private</option>
                  <option value="ICU">ICU</option>
                </select>
              </div>
              <div>
                <Label>Room Price</Label>
                <Input
                  value={form.room?.roomPrice}
                  onChange={(e) =>
                    setForm({ ...form, room: { ...form.room!, roomPrice: e.target.value } })
                  }
                />
              </div>
            </div>

            {/* Bottles & Injections */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Bottles (Count & Price)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Count"
                    value={form.bottles?.count}
                    onChange={(e) =>
                      setForm({ ...form, bottles: { ...form.bottles!, count: e.target.value } })
                    }
                  />
                  <Input
                    placeholder="Price"
                    value={form.bottles?.price}
                    onChange={(e) =>
                      setForm({ ...form, bottles: { ...form.bottles!, price: e.target.value } })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Injections (Count & Price)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Count"
                    value={form.injections?.count}
                    onChange={(e) =>
                      setForm({ ...form, injections: { ...form.injections!, count: e.target.value } })
                    }
                  />
                  <Input
                    placeholder="Price"
                    value={form.injections?.price}
                    onChange={(e) =>
                      setForm({ ...form, injections: { ...form.injections!, price: e.target.value } })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Operation & Other Cost */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Operation Cost</Label>
                <Input
                  value={form.operationCost}
                  onChange={(e) => setForm({ ...form, operationCost: e.target.value })}
                />
              </div>
              <div>
                <Label>Other Cost</Label>
                <Input
                  value={form.otherCost}
                  onChange={(e) => setForm({ ...form, otherCost: e.target.value })}
                />
              </div>
            </div>

            {/* Medicines */}
            <div>
              <Label>Medicines</Label>
              {form.medicines?.map((med, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                  <Input
                    placeholder="Name"
                    value={med.name}
                    onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Quantity"
                    value={med.quantity}
                    onChange={(e) => updateMedicine(index, 'quantity', e.target.value)}
                  />
                  <Input
                    placeholder="Price"
                    value={med.price}
                    onChange={(e) => updateMedicine(index, 'price', e.target.value)}
                  />
                </div>
              ))}
              <Button variant="secondary" onClick={addMedicine} className="mt-2">
                + Add Medicine
              </Button>
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={updateRecord} className="bg-[#76C7C0] hover:bg-[#5CB8AE] text-white">
            Update
          </Button>
        </div>
      </motion.div>
    </div>
  );
}