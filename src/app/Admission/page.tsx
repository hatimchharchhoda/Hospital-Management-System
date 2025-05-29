"use client";
import { PatientFormData } from "@/types/treatment";
import React, { useState } from "react";
import { useSearchParams } from 'next/navigation';

const PatientAdmissionForm = () => {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<PatientFormData>({
    patientId: "",
    assignedDoctorName: "",
    name: searchParams.get('name') || "",
    mobile: searchParams.get('mobile') || "",
    address: searchParams.get('address') || "",
    treatmentFor: "",
    date: "",
    room: { roomNo: "", bedNo: "", roomCategory: "", roomPrice: "" },
    bottles: { count: "", price: "" },
    injections: { count: "", price: "" },
    doctorFees: "",
    operationCost: "",
    otherCost: "",
    medicines: [{ name: "", quantity: "", price: "" }],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOldPatient, setIsOldPatient] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section?: string,
    field?: string,
    index?: number
  ) => {
    const { name, value } = e.target;

    if (section === "medicines" && typeof index === "number") {
      const updatedMedicines = [...formData.medicines];
      updatedMedicines[index] = { ...updatedMedicines[index], [name]: value };
      setFormData({ ...formData, medicines: updatedMedicines });
    } else if (section) {
      setFormData({
        ...formData,
        [section]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(formData as any)[section],
          [name]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [...formData.medicines, { name: "", quantity: "", price: "" }],
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const treatmentRecords = [
      {
        treatmentFor: formData.treatmentFor,
        date: formData.date,
        room: formData.room.roomCategory
          ? {
              roomNo: formData.room.roomNo,
              bedNo: formData.room.bedNo,
              roomCategory: formData.room.roomCategory,
              roomPrice: formData.room.roomPrice,
            }
          : null,
        bottles: formData.bottles,
        injections: formData.injections,
        doctorFees: formData.doctorFees,
        operationCost: formData.operationCost,
        otherCost: formData.otherCost,
        medicines: formData.medicines,
      },
    ];

    const payload = {
      ...(isOldPatient &&
        formData.patientId && { patientId: formData.patientId }),
      assignedDoctorName: formData.assignedDoctorName || null,
      name: formData.name,
      mobile: formData.mobile,
      address: formData.address,
      treatmentRecords,
    };

    try {
      const res = await fetch("/api/patient-admission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Patient submitted successfully");
        // Optionally reset form
        // setFormData(...initial);
      } else {
        alert(data.message || "Error submitting patient");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Patient Admission Form</h2>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={isOldPatient}
            onChange={() => setIsOldPatient(!isOldPatient)}
            className="mr-2"
          />
          Old Patient
        </label>
      </div>

      {isOldPatient && (
        <div>
          <label className="block mb-1">Patient ID</label>
          <input
            type="text"
            name="patientId"
            className="input"
            value={formData.patientId}
            onChange={handleChange}
          />
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block mb-1">Patient Name</label>
          <input
            type="text"
            name="name"
            className="input"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block mb-1">Mobile</label>
          <input
            type="text"
            name="mobile"
            className="input"
            value={formData.mobile}
            onChange={handleChange}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1">Address</label>
          <input
            type="text"
            name="address"
            className="input w-full"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1">Treatment For</label>
          <input
            type="text"
            name="treatment_for"
            className="input"
            value={formData.treatmentFor}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1">Date of Treatment</label>
          <input
            type="date"
            name="date"
            className="input"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1">Room Number</label>
          <input
            type="text"
            name="roomNo"
            className="input"
            value={formData.room.roomNo}
            onChange={(e) => handleChange(e, "room")}
          />
        </div>

        <div>
          <label className="block mb-1">Bed Number</label>
          <input
            type="text"
            name="bedNo"
            className="input"
            value={formData.room.bedNo}
            onChange={(e) => handleChange(e, "room")}
          />
        </div>

        <div>
          <label className="block mb-1">Room Category</label>
          <select
            name="roomCategory"
            className="input"
            value={formData.room.roomCategory}
            onChange={(e) => handleChange(e, "room")}
          >
            <option value="">--Select--</option>
            <option value="general">General</option>
            <option value="semi-private">Semi-Private</option>
            <option value="private">Private</option>
            <option value="ICU">ICU</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Room Price</label>
          <input
            type="number"
            name="roomPrice"
            className="input"
            value={formData.room.roomPrice}
            onChange={(e) => handleChange(e, "room")}
          />
        </div>

        <div>
          <label className="block mb-1">Bottle Count</label>
          <input
            type="number"
            name="count"
            className="input"
            value={formData.bottles.count}
            onChange={(e) => handleChange(e, "bottles")}
          />
        </div>

        <div>
          <label className="block mb-1">Bottle Price</label>
          <input
            type="number"
            name="price"
            className="input"
            value={formData.bottles.price}
            onChange={(e) => handleChange(e, "bottles")}
          />
        </div>

        <div>
          <label className="block mb-1">Injection Count</label>
          <input
            type="number"
            name="count"
            className="input"
            value={formData.injections.count}
            onChange={(e) => handleChange(e, "injections")}
          />
        </div>

        <div>
          <label className="block mb-1">Injection Price</label>
          <input
            type="number"
            name="price"
            className="input"
            value={formData.injections.price}
            onChange={(e) => handleChange(e, "injections")}
          />
        </div>

        <div>
          <label className="block mb-1">Doctor Fees</label>
          <input
            type="number"
            name="doctorFees"
            className="input"
            value={formData.doctorFees}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1">Operation Cost</label>
          <input
            type="number"
            name="operationCost"
            className="input"
            value={formData.operationCost}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1">Other Cost</label>
          <input
            type="number"
            name="otherCost"
            className="input"
            value={formData.otherCost}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Medicines</h3>
        {formData.medicines.map((med, idx) => (
          <div key={idx} className="grid gap-2 md:grid-cols-3 mt-2">
            <input
              type="text"
              name="name"
              placeholder="Medicine Name"
              className="input"
              value={med.name}
              onChange={(e) => handleChange(e, "medicines", "name", idx)}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              className="input"
              value={med.quantity}
              onChange={(e) => handleChange(e, "medicines", "quantity", idx)}
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              className="input"
              value={med.price}
              onChange={(e) => handleChange(e, "medicines", "price", idx)}
            />
          </div>
        ))}
        <button
          type="button"
          className="mt-3 bg-blue-500 text-white px-3 py-1 rounded"
          onClick={addMedicine}
        >
          Add Medicine
        </button>
      </div>

      <div className="mt-6">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default PatientAdmissionForm;
