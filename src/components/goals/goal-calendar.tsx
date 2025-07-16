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
      mode="range"
      selected={dateRange}
      onSelect={(value) => {
        setDateRange({
          from: dateRange.from,
          to: value?.to,
        });
      }}
      className="rounded-md border"
      numberOfMonths={2}
    />
  );
}
