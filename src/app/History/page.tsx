"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

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

  useEffect(() => {
    axios.get("/api/patients-history").then((res) => {
      const raw = res.data.data;
      const arrayData: Patient[] = Object.entries(raw).map(([patientId, details]) => ({
        patientId,
        ...(details as Omit<Patient, "patientId">),
      }));
      setPatients(arrayData);
    });
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <Input
        placeholder="Search by name or patient ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-md mx-auto"
      />

      <div className="space-y-4">
        {filteredPatients.map((patient) => (
          <Card
            key={patient.patientId}
            onClick={() =>
              setExpanded(expanded === patient.patientId ? null : patient.patientId)
            }
            className="cursor-pointer p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center font-semibold text-lg">
              <span>{patient.name}</span>
              <span className="text-sm text-gray-500">
                ID: {patient.patientId}
              </span>
            </div>
            <div className="text-gray-500 mt-1 text-sm">
              <p>Mobile: {patient.mobile}</p>
              <p>Address: {patient.address}</p>
            </div>

            {expanded === patient.patientId && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-2"
              >
                {patient.admissions.map((admission, index) => {
                  const generatePDF = () => {
                    const doc = new jsPDF();
                    doc.setFontSize(16);
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
                    <Card key={index} className="bg-gray-100 p-4">
                      <div className="flex justify-between text-sm font-medium">
                        <span>
                          Admission:{" "}
                          {new Date(admission.dateOfAdmission).toLocaleDateString()}
                        </span>
                        <span>
                          Discharge:{" "}
                          {admission.dateOfDischarge
                            ? new Date(admission.dateOfDischarge).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        <p>Doctor: {admission.assignedDoctorName || "N/A"}</p>
                        <p>Total Bill: ₹{admission.totalBill}</p>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            generatePDF();
                          }}
                          className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded"
                        >
                          Generate PDF
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </motion.div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}