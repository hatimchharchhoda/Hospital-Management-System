"use client";

import { useState } from "react";
import axios from "axios";
import { TreatmentRecord } from "@/types/patients";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface Props {
  patientId: string;
  onClose: () => void;
  onSuccess?: () => void; // optional refresh handler
}

export default function NewTreatmentPopup({ patientId, onClose, onSuccess }: Props) {
  const [open, setOpen] = useState(true);

  const [form, setForm] = useState<TreatmentRecord>({
    treatmentFor: "",
    date: "",
    room: {
      roomNo: "",
      bedNo: "",
      roomCategory: "null",
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
    index?: number
  ) => {
    const { name, value } = e.target;

    if (section === "medicines" && typeof index === "number") {
      const updatedMedicines = [...form.medicines];
      updatedMedicines[index] = { ...updatedMedicines[index], [name]: value };
      setForm({ ...form, medicines: updatedMedicines });
    } else if (section) {
      setForm({
        ...form,
        [section]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(form as any)[section],
          [name]: name === "count" || name === "price" ? Number(value) : value,
        },
      });
    } else {
      setForm({
        ...form,
        [name]:
          name === "doctorFees" ||
          name === "operationCost" ||
          name === "otherCost"
            ? Number(value)
            : value,
      });
    }
  };

  const addMedicine = () => {
    setForm({
      ...form,
      medicines: [...(form.medicines ?? []), { name: "", quantity: "", price: "" }],
    });
  };

  const saveRecord = async () => {
    try {
      const res = await axios.post("/api/add-new-day-patientsRecord", {
        patientId,
        treatmentRecord: form,
      });
      toast({
        title: "Success",
        description: res.data.message || "Successfully added new day patient record",
      });
      onSuccess?.();
      setOpen(false);
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: "Error adding new day patient record",
        variant: "destructive",
      });
      console.error("Error saving record:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) onClose();
    }}>
      {/* You can add a trigger if you want, else skip DialogTrigger */}
      <DialogContent className="bg-[#F5F9FF] p-6 rounded-2xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto text-[#1C1F26]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold mb-4">
            Add New Treatment Record
          </DialogTitle>
        </DialogHeader>

        {/* Treatment For */}
        <div className="mb-4">
          <Label htmlFor="treatmentFor" className="text-sm text-muted-foreground">
            Treatment For
          </Label>
          <Input
            id="treatmentFor"
            type="text"
            value={form.treatmentFor}
            onChange={(e) => setForm({ ...form, treatmentFor: e.target.value })}
            className="mt-1"
          />
        </div>

        {/* Doctor Fees */}
        <div className="mb-4">
          <Label htmlFor="doctorFees" className="text-sm text-muted-foreground">
            Doctor Fees
          </Label>
          <Input
            id="doctorFees"
            type="number"
            onChange={(e) => setForm({ ...form, doctorFees: Number(e.target.value) })}
            className="mt-1"
          />
        </div>

        {/* Date */}
        <div className="mb-4">
          <Label htmlFor="date" className="text-sm text-muted-foreground">
            New Day Treatment Date
          </Label>
          <Input
            id="date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        {/* Room */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Input
            placeholder="Room No"
            value={form.room?.roomNo || ""}
            onChange={(e) =>
              setForm({ ...form, room: { ...form.room!, roomNo: e.target.value } })
            }
          />
          <Input
            placeholder="Bed No"
            value={form.room?.bedNo || ""}
            onChange={(e) =>
              setForm({ ...form, room: { ...form.room!, bedNo: e.target.value } })
            }
          />
          <select
            className="col-span-2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2E86AB] focus:ring-opacity-50"
            value={form.room?.roomCategory}
            onChange={(e) =>
              setForm({
                ...form,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                room: { ...form.room!, roomCategory: e.target.value as any },
              })
            }
          >
            <option value="null">Select Room Category</option>
            <option value="general">General</option>
            <option value="semi-private">Semi-Private</option>
            <option value="private">Private</option>
            <option value="ICU">ICU</option>
          </select>
          <div className="col-span-2">
            <Input
              placeholder="Room Price"
              type="number"
              onChange={(e) => setForm({ ...form, room: { ...form.room!, roomPrice: Number(e.target.value) }})}
            />
          </div>
        </div>

        {/* Bottles & Injections */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Input
            placeholder="Bottle Count"
            type="number"
            value={form.bottles?.count || ""}
            onChange={(e) =>
              setForm({ ...form, bottles: { ...form.bottles!, count: Number(e.target.value) } })
            }
          />
          <Input
            placeholder="Bottle Price"
            type="number"
            value={form.bottles?.price || ""}
            onChange={(e) =>
              setForm({ ...form, bottles: { ...form.bottles!, price: Number(e.target.value) } })
            }
          />
          <Input
            placeholder="Injection Count"
            type="number"
            value={form.injections?.count || ""}
            onChange={(e) =>
              setForm({ ...form, injections: { ...form.injections!, count: Number(e.target.value) } })
            }
          />
          <Input
            placeholder="Injection Price"
            type="number"
            value={form.injections?.price || ""}
            onChange={(e) =>
              setForm({ ...form, injections: { ...form.injections!, price: Number(e.target.value) } })
            }
          />
        </div>

        {/* Other Costs */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Input
            placeholder="Operation Cost"
            type="number"
            value={form.operationCost || ""}
            onChange={(e) => setForm({ ...form, operationCost: Number(e.target.value) })}
          />
          <Input
            placeholder="Other Cost"
            type="number"
            value={form.otherCost || ""}
            onChange={(e) => setForm({ ...form, otherCost: Number(e.target.value) })}
          />
        </div>

        {/* Medicines List */}
        <div className="mb-6">
          <Label className="text-sm text-muted-foreground mb-2 block">Medicines</Label>
          {form.medicines.map((med, idx) => (
            <div key={idx} className="grid gap-2 md:grid-cols-3 mb-3">
              <Input
                type="text"
                name="name"
                placeholder="Medicine Name"
                value={med.name}
                onChange={(e) => handleChange(e, "medicines", idx)}
              />
              <Input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={med.quantity}
                onChange={(e) => handleChange(e, "medicines", idx)}
              />
              <Input
                type="number"
                name="price"
                placeholder="Price"
                value={med.price}
                onChange={(e) => handleChange(e, "medicines", idx)}
              />
            </div>
          ))}

          <Button variant="outline" size="sm" onClick={addMedicine}>
            Add Medicine
          </Button>
        </div>

        {/* Actions */}
        <DialogFooter className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={saveRecord} className="bg-[#76C7C0] hover:bg-[#5bb0ab]" type="button">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}