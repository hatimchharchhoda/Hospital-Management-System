"use client";

import { PatientFormData } from "@/types/treatment";
import React, { useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

const PatientAdmissionForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
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
        toast({
          title: "Success",
          description: data.message ||"Patient admitted successfully",
        });
         router.push('/Active_Patient');
      } else {
        toast({
          title: "Error",
          description: data.message ||"Error admitting patient",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast({
          title: "Error",
          description: "Unexpected error occurred",
          variant: "destructive",
        });
    } finally {
      setIsSubmitting(false);
    }
  };

 return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-[#e3f0ff] via-[#d2e8ff] to-[#ffffff] 
                 flex items-center justify-center px-6 py-12"
    >
      <Card className="w-full max-w-4xl rounded-2xl border border-[#2E86AB] bg-white shadow-xl drop-shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-[#2E86AB]">
            Patient Admission Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={isOldPatient}
                onChange={() => setIsOldPatient(!isOldPatient)}
                className="rounded border-gray-300 text-[#76C7C0] focus:ring-[#2E86AB]"
              />
              Old Patient
            </label>
          </div>

          {isOldPatient && (
            <div className="mb-4">
              <Label htmlFor="patientId" className="text-sm text-[#1C1F26]">
                Patient ID
              </Label>
              <Input
                id="patientId"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter patient ID"
              />
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="name" className="text-sm text-[#1C1F26]">
                Patient Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter patient name"
              />
            </div>

            <div>
              <Label htmlFor="mobile" className="text-sm text-[#1C1F26]">
                Mobile
              </Label>
              <Input
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="mt-1"
                placeholder="Enter mobile number"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="address" className="text-sm text-[#1C1F26]">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 w-full"
                placeholder="Enter address"
              />
            </div>

            <div>
              <Label htmlFor="treatment_for" className="text-sm text-[#1C1F26]">
                Treatment For
              </Label>
              <Input
                id="treatment_for"
                name="treatmentFor"
                value={formData.treatmentFor}
                onChange={handleChange}
                className="mt-1"
                placeholder="Treatment purpose"
              />
            </div>

            <div>
              <Label htmlFor="date" className="text-sm text-[#1C1F26]">
                Date of Treatment
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            {/* Room info inputs */}
            <div>
              <Label htmlFor="roomNo" className="text-sm text-[#1C1F26]">
                Room Number
              </Label>
              <Input
                id="roomNo"
                name="roomNo"
                value={formData.room.roomNo}
                onChange={(e) => handleChange(e, "room")}
                className="mt-1"
                placeholder="Room number"
              />
            </div>

            <div>
              <Label htmlFor="bedNo" className="text-sm text-[#1C1F26]">
                Bed Number
              </Label>
              <Input
                id="bedNo"
                name="bedNo"
                value={formData.room.bedNo}
                onChange={(e) => handleChange(e, "room")}
                className="mt-1"
                placeholder="Bed number"
              />
            </div>

            <div>
              <Label htmlFor="roomCategory" className="text-sm text-[#1C1F26]">
                Room Category
              </Label>
              <select
                id="roomCategory"
                name="roomCategory"
                className="input mt-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-[#1C1F26] focus:outline-none focus:ring-2 focus:ring-[#2E86AB]"
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
              <Label htmlFor="roomPrice" className="text-sm text-[#1C1F26]">
                Room Price
              </Label>
              <Input
                id="roomPrice"
                name="roomPrice"
                type="number"
                value={formData.room.roomPrice}
                onChange={(e) => handleChange(e, "room")}
                className="mt-1"
                placeholder="Room price"
              />
            </div>

            {/* Bottles */}
            <div>
              <Label htmlFor="bottleCount" className="text-sm text-[#1C1F26]">
                Bottle Count
              </Label>
              <Input
                id="bottleCount"
                name="count"
                type="number"
                value={formData.bottles.count}
                onChange={(e) => handleChange(e, "bottles")}
                className="mt-1"
                placeholder="Bottle count"
              />
            </div>

            <div>
              <Label htmlFor="bottlePrice" className="text-sm text-[#1C1F26]">
                Bottle Price
              </Label>
              <Input
                id="bottlePrice"
                name="price"
                type="number"
                value={formData.bottles.price}
                onChange={(e) => handleChange(e, "bottles")}
                className="mt-1"
                placeholder="Bottle price"
              />
            </div>

            {/* Injections */}
            <div>
              <Label htmlFor="injectionCount" className="text-sm text-[#1C1F26]">
                Injection Count
              </Label>
              <Input
                id="injectionCount"
                name="count"
                type="number"
                value={formData.injections.count}
                onChange={(e) => handleChange(e, "injections")}
                className="mt-1"
                placeholder="Injection count"
              />
            </div>

            <div>
              <Label htmlFor="injectionPrice" className="text-sm text-[#1C1F26]">
                Injection Price
              </Label>
              <Input
                id="injectionPrice"
                name="price"
                type="number"
                value={formData.injections.price}
                onChange={(e) => handleChange(e, "injections")}
                className="mt-1"
                placeholder="Injection price"
              />
            </div>

            {/* Fees & Costs */}
            <div>
              <Label htmlFor="doctorFees" className="text-sm text-[#1C1F26]">
                Doctor Fees
              </Label>
              <Input
                id="doctorFees"
                name="doctorFees"
                type="number"
                value={formData.doctorFees}
                onChange={handleChange}
                className="mt-1"
                placeholder="Doctor fees"
              />
            </div>

            <div>
              <Label htmlFor="operationCost" className="text-sm text-[#1C1F26]">
                Operation Cost
              </Label>
              <Input
                id="operationCost"
                name="operationCost"
                type="number"
                value={formData.operationCost}
                onChange={handleChange}
                className="mt-1"
                placeholder="Operation cost"
              />
            </div>

            <div>
              <Label htmlFor="otherCost" className="text-sm text-[#1C1F26]">
                Other Cost
              </Label>
              <Input
                id="otherCost"
                name="otherCost"
                type="number"
                value={formData.otherCost}
                onChange={handleChange}
                className="mt-1"
                placeholder="Other cost"
              />
            </div>
          </div>

          {/* Medicines */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-[#1C1F26] mb-3">Medicines</h3>
            <ScrollArea className="max-h-48 rounded-lg border border-gray-200 p-3 bg-white">
              {formData.medicines.map((med, idx) => (
                <div key={idx} className="grid gap-4 md:grid-cols-3 mb-4">
                  <Input
                    type="text"
                    name="name"
                    placeholder="Medicine Name"
                    value={med.name}
                    onChange={(e) => handleChange(e, "medicines", "name", idx)}
                    className="rounded-md border border-gray-300 px-3 py-2 text-base text-[#1C1F26]"
                  />
                  <Input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={med.quantity}
                    onChange={(e) => handleChange(e, "medicines", "quantity", idx)}
                    className="rounded-md border border-gray-300 px-3 py-2 text-base text-[#1C1F26]"
                  />
                  <Input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={med.price}
                    onChange={(e) => handleChange(e, "medicines", "price", idx)}
                    className="rounded-md border border-gray-300 px-3 py-2 text-base text-[#1C1F26]"
                  />
                </div>
              ))}
            </ScrollArea>
            <Button
              variant="outline"
              className="mt-3 border-[#76C7C0] text-[#2E86AB] hover:bg-[#76C7C0] hover:text-white transition"
              onClick={addMedicine}
              type="button"
            >
              Add Medicine
            </Button>
          </div>

          {/* Submit */}
          <div className="mt-10">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#2E86AB] hover:bg-[#1B5F73] text-white px-8 py-3 rounded-2xl transition"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PatientAdmissionForm;