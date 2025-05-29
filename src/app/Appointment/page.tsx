"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Calendar from "@/components/Calender";
import { AppointmentPopup } from "@/components/AppointmentPopup";

const AppointmentPage = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarKey, setCalendarKey] = useState(0);

  const refreshCalendar = () => {
    setCalendarKey((prev) => prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-[#F5F9FF] via-white to-[#F5F9FF] 
                 px-4 py-6 md:px-6 text-[#1C1F26]"
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-[#2E86AB]">Appointments</h1>

        <div className="rounded-2xl shadow-lg border border-[#E0EAF4] bg-white p-4 md:p-6 transition-all duration-300">
          <Calendar onSelectDate={setSelectedDate} refreshSignal={calendarKey} />
        </div>

        {selectedDate && (
          <AppointmentPopup
            date={selectedDate}
            onClose={() => setSelectedDate(null)}
            onRefreshCalendar={refreshCalendar}
          />
        )}
      </div>
    </motion.div>
  );
};

export default AppointmentPage;