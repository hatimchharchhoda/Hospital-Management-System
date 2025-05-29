import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { format, addDays } from 'date-fns';
import { toast } from '@/hooks/use-toast';

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
    try {
      const res = await fetch('/api/appointment/full');
      const data = await res.json();
      if (!res.ok || !data.success || !Array.isArray(data.fullDates)) {
        console.error('Invalid response from /api/appointment/full:', data);
        setFullDays([]); // set empty instead of undefined
        return;
      }
      setFullDays(data.fullDates);
    } catch (error) {
      toast({ title: 'Error', description:'Failed to load appointment data.', variant: 'destructive' });
      console.error('Fetch fullDates failed:', error);
      setFullDays([]); // set to empty array on error
    }
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
    <div className="space-y-10 mt-6">
      {Object.entries(groupedByMonth).map(([monthYear, monthDates]) => (
        <div key={monthYear}>
          <h2 className="text-2xl font-semibold text-[#2E86AB] mb-4">
            {monthYear}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {monthDates.map((date) => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const isFull = Array.isArray(fullDays) && fullDays.includes(dateStr);

              return (
                <div
                  key={dateStr}
                  onClick={() => onSelectDate(dateStr)}
                  className={cn(
                    'rounded-2xl p-4 cursor-pointer shadow-sm text-center transition-colors duration-200',
                    isFull
                      ? 'bg-[#F4D35E] text-[#1C1F26] font-semibold'
                      : 'bg-[#F5F9FF] hover:bg-[#76C7C0]/20 text-[#1C1F26]'
                  )}
                >
                  <div className="text-lg font-medium">
                    {format(date, 'dd')}
                  </div>
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