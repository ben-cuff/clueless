'use client';

import { Dispatch, SetStateAction } from 'react';
import { DateRange } from 'react-day-picker';
import { Calendar } from '../ui/calendar';

export default function GoalCalendar({
  dateRange,
  setDateRange,
}: {
  dateRange: DateRange;
  setDateRange: Dispatch<SetStateAction<DateRange>>;
}) {
  return (
    <Calendar
      mode="single"
      selected={dateRange.to}
      onSelect={(value) => {
        setDateRange({ from: dateRange.from, to: value });
      }}
      className="rounded-md border"
      numberOfMonths={2}
    />
  );
}
