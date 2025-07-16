import { ActivityForHeatmap } from '@/types/activity';
import { Optional } from '@/types/util';
import { daysInWeek, daysInYear } from 'date-fns/constants';
import HeatmapGrid from './heatmap-grid';
import MonthLabels from './month-labels';

export default function CalendarHeatmap({
  dateValues,
  numDays = daysInYear,
  showMonthLabels = true,
  title = 'Heatmap',
}: {
  dateValues: ActivityForHeatmap[];
  numDays?: number;
  showMonthLabels?: boolean;
  title?: string;
}) {
  const daysArray = generateDaysArray(numDays);

  // Sort dateValues by date ascending to ensure correct mapping
  const sortedDateValues = [...dateValues].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  const valueMap = new Map(
    sortedDateValues.map(({ date, value }) => [date.toDateString(), value])
  );

  const weeks = groupDaysIntoWeeks(daysArray);

  return (
    <>
      <h3 className="mb-2 font-bold">{title}</h3>
      {showMonthLabels && <MonthLabels weeks={weeks} />}
      <HeatmapGrid weeks={weeks} valueMap={valueMap} />
    </>
  );
}

// gets an array of dates with the specified number of days
function generateDaysArray(numDays: number) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const array: Date[] = [];

  const roundedNumDays = Math.round(numDays);

  for (let i = 0; i < roundedNumDays; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - (roundedNumDays - 1 - i));
    array.push(d);
  }
  return array;
}

function groupDaysIntoWeeks(daysArray: Date[]): Optional<Date>[][] {
  const weeks: Optional<Date>[][] = [];
  let week: Optional<Date>[] = [];

  // pads the first week with undefined to account for weeks not starting on sunday
  const firstDay = daysArray[0];
  for (let i = 0; i < firstDay.getDay(); i++) {
    week.push(undefined);
  }

  daysArray.forEach((date) => {
    week.push(date);
    if (week.length === daysInWeek) {
      weeks.push(week);
      week = [];
    }
  });

  // pads the last week with undefined to make sure it is full
  if (week.length > 0) {
    while (week.length < daysInWeek) {
      week.push(undefined);
    }
    weeks.push(week);
  }
  return weeks;
}
