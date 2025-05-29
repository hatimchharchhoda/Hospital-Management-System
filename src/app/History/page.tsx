"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

interface AdmissionSummary {
  dateOfAdmission: string;
  dateOfDischarge?: string;
  assignedDoctorName?: string;
  totalBill: number;
  treatmentFor: string;
  doctorFees?: number;
  bottleCost?: number;
  injectionCost?: number;
  roomCost?: number;
  medicineCost?: number;
  operationCost?: number;
  otherCharges?: number;
}

interface Patient {
  patientId: string;
  name: string;
  address: string;
  mobile: string;
  admissions: AdmissionSummary[];
}

export default function PatientHistoryPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/patients-history")
      .then((res) => {
        const raw = res.data.data;
        const arrayData: Patient[] = Object.entries(raw).map(
          ([patientId, details]) => ({
            patientId,
            ...(details as Omit<Patient, "patientId">),
          })
        );
        setPatients(arrayData);
      })
      .catch((err) => {
        toast({ title: "Error", description: err.message });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePDF = (patient: Patient, admission: AdmissionSummary) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor("#2E86AB");
    doc.text(`Patient Bill - ${patient.name}`, 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Field", "Value"]],
      body: [
        ["Patient ID", patient.patientId],
        ["Name", patient.name],
        ["Address", patient.address],
        ["Mobile", patient.mobile],
        ["Treatment For", admission.treatmentFor || "N/A"],
        [
          "Date of Admission",
          new Date(admission.dateOfAdmission).toLocaleDateString(),
        ],
        [
          "Date of Discharge",
          admission.dateOfDischarge
            ? new Date(admission.dateOfDischarge).toLocaleDateString()
            : "N/A",
        ],
        ["Doctor Assigned", admission.assignedDoctorName || "N/A"],
        ["Doctor Fees", `₹${admission.doctorFees ?? 0}`],
        ["Bottle Cost", `₹${admission.bottleCost ?? 0}`],
        ["Injection Cost", `₹${admission.injectionCost ?? 0}`],
        ["Room Cost", `₹${admission.roomCost ?? 0}`],
        ["Medicine Cost", `₹${admission.medicineCost ?? 0}`],
        ["Operation Cost", `₹${admission.operationCost ?? 0}`],
        ["Other Charges", `₹${admission.otherCharges ?? 0}`],
        ["Total Bill", `₹${admission.totalBill}`],
      ],
    });

    doc.save(`Bill-${patient.name}.pdf`);
  };

  return (
    <div className="p-6 md:p-8 bg-[#F5F9FF] min-h-screen">
      <h1 className="text-2xl font-semibold text-[#2E86AB] mb-6 text-center">
        Patient History
      </h1>

      <div className="max-w-md mx-auto mb-8">
        <Input
          placeholder="Search by name or patient ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-[#2E86AB] focus:ring-2 focus:ring-[#76C7C0] transition"
        />
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        {loading ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <Card
              key={idx}
              className="p-5 rounded-2xl shadow-md bg-white border border-[#2E86AB]"
            >
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-1/3 bg-[#E3F2FD]" />
                <Skeleton className="h-4 w-24 bg-[#E3F2FD]" />
              </div>
              <div className="mt-2 space-y-2">
                <Skeleton className="h-4 w-3/4 bg-[#F5F9FF]" />
                <Skeleton className="h-4 w-1/2 bg-[#F5F9FF]" />
              </div>
              <div className="mt-4 space-y-4">
                <Card className="p-4 rounded-xl bg-[#E3F2FD] border border-[#76C7C0]">
                  <Skeleton className="h-4 w-full bg-[#D6ECF3]" />
                  <Skeleton className="h-4 w-1/2 mt-2 bg-[#D6ECF3]" />
                  <Skeleton className="h-8 w-24 mt-4 bg-[#76C7C0]" />
                </Card>
              </div>
            </Card>
          ))
        ) : filteredPatients.length === 0 ? (
          <p className="text-center text-[#1C1F26] text-base font-medium">
            No patients found.
          </p>
        ) : (
          filteredPatients.map((patient) => (
            <Card
              key={patient.patientId}
              onClick={() =>
                setExpanded(
                  expanded === patient.patientId ? null : patient.patientId
                )
              }
              className="cursor-pointer p-5 rounded-2xl shadow-md bg-white border border-[#2E86AB] hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-[#2E86AB]">
                  {patient.name}
                </h2>
                <span className="text-sm text-gray-500 select-none">
                  ID: {patient.patientId}
                </span>
              </div>
              <div className="mt-1 text-sm text-[#1C1F26] space-y-1">
                <p>Mobile: {patient.mobile}</p>
                <p>Address: {patient.address}</p>
              </div>

              <AnimatePresence initial={false}>
                {expanded === patient.patientId && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {patient.admissions.map((admission, idx) => (
                      <Card
                        key={idx}
                        className="bg-[#E3F2FD] p-4 rounded-xl border border-[#76C7C0]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-between text-sm font-medium text-[#1C1F26]">
                          <span>
                            Admission:{" "}
                            {new Date(
                              admission.dateOfAdmission
                            ).toLocaleDateString()}
                          </span>
                          <span>
                            Discharge:{" "}
                            {admission.dateOfDischarge
                              ? new Date(
                                  admission.dateOfDischarge
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-[#1C1F26] space-y-1">
                          <p>Doctor: {admission.assignedDoctorName || "N/A"}</p>
                          <p>
                            Total Bill: ₹{admission.totalBill.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generatePDF(patient, admission)}
                            className="bg-[#76C7C0] text-white hover:bg-[#5aa9a4] transition-colors"
                          >
                            Generate PDF
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}