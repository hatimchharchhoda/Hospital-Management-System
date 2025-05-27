import { useState } from 'react';
import axios from 'axios';
import { TreatmentRecord } from '@/types/patients';

// Props
interface Props {
  patientId: string;
  onClose: () => void;
  onSuccess?: () => void; // optional refresh handler
}

export default function NewTreatmentPopup({ patientId, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<TreatmentRecord>({
    treatment_for: '',
    date: new Date().toISOString(),
    room: {
      roomNo: '',
      bedNo: '',
      roomCategory: 'null',
      roomPrice: 0,
    },
    bottles: { count: 0, price: 0 },
    injections: { count: 0, price: 0 },
    doctorFees: 0,
    operationCost: 0,
    otherCost: 0,
    medicines: [],
  });


  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      section?: string,
      field?: string,
      index?: number
    ) => {
      const { name, value } = e.target;
  
      if (section === 'medicines' && typeof index === 'number') {
        const updatedMedicines = [...form.medicines];
        updatedMedicines[index] = { ...updatedMedicines[index], [name]: value };
        setForm({ ...form, medicines: updatedMedicines });
      } else if (section) {
        setForm({
          ...form,
          [section]: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(form as any)[section],
            [name]: value,
          },
        });
      } else {
        setForm({ ...form, [name]: value });
      }
    };
//   const addMedicine = () => {
//     if (!newMed.name || !newMed.quantity || !newMed.price) return;
//     setForm({
//       ...form,
//       medicines: [
//         ...form.medicines,
//         {
//           name: newMed.name,
//           quantity: newMed.quantity,
//           price: newMed.price,
//         },
//       ],
//     });
//     setNewMed({ name: '', quantity: '', price: '' });
//   };

  const saveRecord = async () => {
    try {
      await axios.post('/api/add-new-day-patientsRecord', {
        patientId,
        treatmentRecord: form,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Error saving record:', err);
    }
  };

  const addMedicine = () => {
    setForm({
      ...form,
      medicines: [...(form.medicines ?? []), { name: '', quantity: '', price: '' }],
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <h3 className="text-lg font-bold mb-4">Add New Treatment Record</h3>

        {/* Treatment For */}
        <div className="mb-3">
          <label className="block text-sm font-medium">Treatment For</label>
          <input
            type="text"
            className="w-full border px-3 py-1 rounded"
            value={form.treatment_for}
            onChange={(e) => setForm({ ...form, treatment_for: e.target.value })}
          />
        </div>

        {/* Doctor Fees */}
        <div className="mb-3">
          <label className="block text-sm font-medium">Doctor Fees</label>
          <input
            type="number"
            className="w-full border px-3 py-1 rounded"
            value={form.doctorFees}
            onChange={(e) => setForm({ ...form, doctorFees: Number(e.target.value) })}
          />
        </div>

        {/* Room */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <input
            placeholder="Room No"
            className="border px-3 py-1 rounded"
            value={form.room?.roomNo || ''}
            onChange={(e) =>
              setForm({ ...form, room: { ...form.room!, roomNo: e.target.value } })
            }
          />
          <input
            placeholder="Bed No"
            className="border px-3 py-1 rounded"
            value={form.room?.bedNo || ''}
            onChange={(e) =>
              setForm({ ...form, room: { ...form.room!, bedNo: e.target.value } })
            }
          />
          <select
            className="col-span-2 border px-3 py-1 rounded"
            value={form.room?.roomCategory}
            onChange={(e) =>
              setForm({ ...form, room: { ...form.room!, roomCategory: e.target.value as 'general' | 'semi-private' | 'private' | 'ICU' | 'null' } })
            }
          >
            <option value="null">Select Room Category</option>
            <option value="general">General</option>
            <option value="semi-private">Semi-Private</option>
            <option value="private">Private</option>
            <option value="ICU">ICU</option>
          </select>
        </div>

        {/* Bottles & Injections */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <input
            placeholder="Bottle Count"
            type="number"
            className="border px-3 py-1 rounded"
            value={form.bottles?.count || ''}
            onChange={(e) => setForm({ ...form, bottles: { ...form.bottles!, count: Number(e.target.value) } })}
          />
          <input
            placeholder="Bottle Price"
            type="number"
            className="border px-3 py-1 rounded"
            value={form.bottles?.price || ''}
            onChange={(e) => setForm({ ...form, bottles: { ...form.bottles!, price: Number(e.target.value) } })}
          />
          <input
            placeholder="Injection Count"
            type="number"
            className="border px-3 py-1 rounded"
            value={form.injections?.count || ''}
            onChange={(e) => setForm({ ...form, injections: { ...form.injections!, count: Number(e.target.value) } })}
          />
          <input
            placeholder="Injection Price"
            type="number"
            className="border px-3 py-1 rounded"
            value={form.injections?.price || ''}
            onChange={(e) => setForm({ ...form, injections: { ...form.injections!, price: Number(e.target.value) } })}
          />
        </div>

        {/* Other Costs */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <input
            placeholder="Operation Cost"
            type="number"
            className="border px-3 py-1 rounded"
            value={form.operationCost || ''}
            onChange={(e) => setForm({ ...form, operationCost: Number(e.target.value) })}
          />
          <input
            placeholder="Other Cost"
            type="number"
            className="border px-3 py-1 rounded"
            value={form.otherCost || ''}
            onChange={(e) => setForm({ ...form, otherCost: Number(e.target.value) })}
          />
        </div>

        {/* Medicines List */}
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1">Medicines</label>
          {form.medicines.map((med, idx) => (
          <div key={idx} className="grid gap-2 md:grid-cols-3 mt-2">
            <input type="text" name="name" placeholder="Medicine Name" className="input" value={med.name} onChange={(e) => handleChange(e, 'medicines', 'name', idx)} />
            <input type="number" name="quantity" placeholder="Quantity" className="input" value={med.quantity} onChange={(e) => handleChange(e, 'medicines', 'quantity', idx)} />
            <input type="number" name="price" placeholder="Price" className="input" value={med.price} onChange={(e) => handleChange(e, 'medicines', 'price', idx)} />
          </div>
        ))}
            <button
              onClick={addMedicine}
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-1 border rounded">
            Cancel
          </button>
          <button
            onClick={saveRecord}
            className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>
      </div>
  );
}