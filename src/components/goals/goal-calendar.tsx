"use client";

import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Calendar } from "../ui/calendar";

export default function GoalCalendar() {
  const TWO_WEEKS_IN_MILLISECONDS = 14 * 24 * 60 * 60 * 1000;

  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: new Date(Date.now() + TWO_WEEKS_IN_MILLISECONDS),
  });

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
