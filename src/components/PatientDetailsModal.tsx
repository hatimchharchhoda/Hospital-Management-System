"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import DateTreatmentPopup from "@/components/DateTreatmentPopup";
import NewTreatmentPopup from "./NewTreatmentPopup";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patient: any;
  onClose: () => void;
  onSuccess?: () => void; // optional refresh handler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchPatientRecords: any;
}

export default function PatientDetailsModal({ patient, onClose, fetchPatientRecords }: Props) {
  const [addingNew, setAddingNew] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const sortedRecords = [...patient.treatmentRecords].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black z-50"
        onClick={onClose}
      />

      <motion.div
        key="modal"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex justify-center items-start pt-10 px-4"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-[#F5F9FF] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] shadow-lg flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#2E86AB]">
              Patient Details - {patient.name}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-[#1C1F26] hover:text-[#2E86AB]"
              aria-label="Close patient details modal"
            >
              ✕
            </Button>
          </div>

          {/* Treatment Records List with ScrollArea */}
          <ScrollArea className="flex-1 border rounded-xl border-blue-100 p-3 mb-6">
            <div className="space-y-3">
              {sortedRecords.map((record, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(record)}
                  className="cursor-pointer rounded-lg p-3 hover:bg-[#E6F0FA] transition-colors"
                >
                  <div className="font-semibold text-[#1C1F26]">
                    {new Date(record.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {record.room?.roomCategory && `Room: ${record.room.roomCategory}, `}
                    {record.room?.roomNo && `Room No: ${record.room.roomNo}, `}
                    {record.room?.bedNo && `Bed No: ${record.room.bedNo}`}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* New Record Button */}
          <Button
            className="w-full bg-[#2E86AB] hover:bg-[#1B5F82] transition-colors"
            onClick={() => setAddingNew(true)}
          >
            + New Day Record
          </Button>

          {/* New Treatment Popup */}
          {addingNew && (
            <NewTreatmentPopup
              patientId={patient}
              onClose={() => setAddingNew(false)}
              onSuccess={() => setAddingNew(false)}
            />
          )}

          {/* Selected Date Popup */}
          {selectedDate && (
            <DateTreatmentPopup
              patientId={patient._id}
              record={selectedDate}
              onClose={() => setSelectedDate(null)}
              onSuccess={fetchPatientRecords}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}