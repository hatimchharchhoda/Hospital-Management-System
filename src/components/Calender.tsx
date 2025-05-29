import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';

type CalendarProps = {
  onSelectDate: (date: string) => void;
  refreshSignal: number;
};

const Calendar = ({ onSelectDate, refreshSignal }: CalendarProps) => {
  const [dates, setDates] = useState<Date[]>([]);
  const [fullDays, setFullDays] = useState<string[]>([]);

  useEffect(() => {
    const today = new Date();
    const next30 = Array.from({ length: 30 }, (_, i) => addDays(today, i));
    setDates(next30);
  }, []);

  const fetchFullDates = async () => {
    const res = await fetch('/api/appointment/full');
    const data = await res.json();
    setFullDays(data.fullDates);
  };

  useEffect(() => {
    fetchFullDates();
  }, [refreshSignal]);

  // Group dates by month
  const groupedByMonth: { [key: string]: Date[] } = {};
  dates.forEach((date) => {
    const key = format(date, 'MMMM yyyy');
    if (!groupedByMonth[key]) groupedByMonth[key] = [];
    groupedByMonth[key].push(date);
  });

  return (
    <div className="space-y-8 mt-6">
      {Object.entries(groupedByMonth).map(([monthYear, monthDates]) => (
        <div key={monthYear}>
          <h2 className="text-xl font-semibold mb-4">{monthYear}</h2>
          <div className="grid grid-cols-6 gap-4">
            {monthDates.map((date) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const isFull = fullDays.includes(dateStr);

              return (
                <div
                  key={dateStr}
                  onClick={() => onSelectDate(dateStr)}
                  className={cn(
                    'rounded-xl p-4 cursor-pointer shadow-sm hover:bg-muted text-center',
                    isFull ? 'bg-red-200 text-red-800' : 'bg-white'
                  )}
                >
                  <div className="font-semibold text-lg">{format(date, 'dd')}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Calendar;