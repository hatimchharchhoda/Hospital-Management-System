'use client'
import React, { useState } from 'react';
import Calendar from '@/components/Calender';
import { AppointmentPopup } from '@/components/AppointmentPopup';

const AppointmentPage = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarKey, setCalendarKey] = useState(0); // change to refresh calendar

  const refreshCalendar = () => {
    setCalendarKey((prev) => prev + 1); // force calendar refresh
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>
      <Calendar onSelectDate={setSelectedDate} refreshSignal={calendarKey} />
      {selectedDate && (
        <AppointmentPopup
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
          onRefreshCalendar={refreshCalendar}
        />
      )}
    </div>
  );
};

export default AppointmentPage;