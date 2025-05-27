import { useState } from 'react';
import axios from 'axios';

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
  treatment_for: string;
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
  record: Partial<PatientFormData>; // Only treatment fields are used
  onClose: () => void;
  onSuccess: () => void;
}

export default function DateTreatmentPopup({ patientId, record, onClose }: Props) {
  const [form, setForm] = useState<Partial<PatientFormData>>({
    treatment_for: record.treatment_for ?? '',
    room: {
      roomNo: record.room?.roomNo ?? '',
      bedNo: record.room?.bedNo ?? '',
      roomCategory: record.room?.roomCategory ?? '',
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
      await axios.put('/api/update-patient-records', {
        patientId,
        date: record.date,
        updatedTreatmentRecord: form,
      });
      onClose();
    } catch (err) {
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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">
          Edit Treatment for {new Date(record.date ?? '').toLocaleDateString()}
        </h3>

        {/* Doctor Fees */}
        <div className="mb-3">
          <label className="block text-sm font-medium">Doctor Fees</label>
          <input
            type="text"
            value={form.doctorFees}
            onChange={(e) => setForm({ ...form, doctorFees: e.target.value })}
            className="w-full border px-3 py-1 rounded"
          />
        </div>

        {/* Room Details */}
        <div className="mb-3 grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm block font-medium">Room No</label>
            <input
              type="text"
              value={form.room?.roomNo}
              onChange={(e) =>
                setForm({ ...form, room: { ...form.room!, roomNo: e.target.value } })
              }
              className="w-full border px-3 py-1 rounded"
            />
          </div>
          <div>
            <label className="text-sm block font-medium">Bed No</label>
            <input
              type="text"
              value={form.room?.bedNo}
              onChange={(e) =>
                setForm({ ...form, room: { ...form.room!, bedNo: e.target.value } })
              }
              className="w-full border px-3 py-1 rounded"
            />
          </div>
          <div>
            <label className="text-sm block font-medium">Room Category</label>
            <select
              value={form.room?.roomCategory}
              onChange={(e) =>
                setForm({ ...form, room: { ...form.room!, roomCategory: e.target.value } })
              }
              className="w-full border px-3 py-1 rounded"
            >
              <option value="">Select Category</option>
              <option value="general">General</option>
              <option value="semi-private">Semi-private</option>
              <option value="private">Private</option>
              <option value="ICU">ICU</option>
            </select>
          </div>
          <div>
            <label className="text-sm block font-medium">Room Price</label>
            <input
              type="text"
              value={form.room?.roomPrice}
              onChange={(e) =>
                setForm({ ...form, room: { ...form.room!, roomPrice: e.target.value } })
              }
              className="w-full border px-3 py-1 rounded"
            />
          </div>
        </div>

        {/* Bottles & Injections */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-sm font-medium block">Bottles</label>
            <input
              type="text"
              value={form.bottles?.count}
              onChange={(e) =>
                setForm({ ...form, bottles: { ...form.bottles!, count: e.target.value } })
              }
              className="w-full border px-3 py-1 rounded mb-1"
              placeholder="Count"
            />
            <input
              type="text"
              value={form.bottles?.price}
              onChange={(e) =>
                setForm({ ...form, bottles: { ...form.bottles!, price: e.target.value } })
              }
              className="w-full border px-3 py-1 rounded"
              placeholder="Price"
            />
          </div>

          <div>
            <label className="text-sm font-medium block">Injections</label>
            <input
              type="text"
              value={form.injections?.count}
              onChange={(e) =>
                setForm({
                  ...form,
                  injections: { ...form.injections!, count: e.target.value },
                })
              }
              className="w-full border px-3 py-1 rounded mb-1"
              placeholder="Count"
            />
            <input
              type="text"
              value={form.injections?.price}
              onChange={(e) =>
                setForm({
                  ...form,
                  injections: { ...form.injections!, price: e.target.value },
                })
              }
              className="w-full border px-3 py-1 rounded"
              placeholder="Price"
            />
          </div>
        </div>

        {/* Operation & Other Cost */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="block text-sm font-medium">Operation Cost</label>
            <input
              type="text"
              value={form.operationCost}
              onChange={(e) =>
                setForm({ ...form, operationCost: e.target.value })
              }
              className="w-full border px-3 py-1 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Other Cost</label>
            <input
              type="text"
              value={form.otherCost}
              onChange={(e) =>
                setForm({ ...form, otherCost: e.target.value })
              }
              className="w-full border px-3 py-1 rounded"
            />
          </div>
        </div>

        {/* Medicines */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Medicines</label>
          {form.medicines?.map((med, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                placeholder="Name"
                value={med.name}
                onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                className="border px-3 py-1 rounded"
              />
              <input
                type="text"
                placeholder="Quantity"
                value={med.quantity}
                onChange={(e) => updateMedicine(index, 'quantity', e.target.value)}
                className="border px-3 py-1 rounded"
              />
              <input
                type="text"
                placeholder="Price"
                value={med.price}
                onChange={(e) => updateMedicine(index, 'price', e.target.value)}
                className="border px-3 py-1 rounded"
              />
            </div>
          ))}
          <button type="button" className="mt-3 bg-blue-500 text-white px-3 py-1 rounded" onClick={addMedicine}>
            Add Medicine
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-1 border rounded">
            Cancel
          </button>
          <button
            onClick={updateRecord}
            className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}