import { activityForHeatmap } from "@/types/activity";
import { daysInWeek, daysInYear } from "date-fns/constants";

export default function CalendarHeatmap({
  numDays = daysInYear,
  dateValues,
  title = "Heatmap",
}: {
  numDays?: number;
  dateValues: activityForHeatmap[];
  title: string;
}) {
  const daysArray = generateDaysArray(numDays);

  const valueMap = new Map(
    dateValues.map(({ date, value }) => [date.toDateString(), value])
  );

  const weeks = groupDaysIntoWeeks(daysArray);

  const getColor = getColorFunctionBasedOnPercentile(valueMap);

  return (
    <div>
      <h3 className="mb-2 font-bold">{title}</h3>
      <div className="flex flex-row">
        {weeks.map((weekDays, weekIndex) => (
          <div key={weekIndex}>
            {Array.from({ length: 7 }).map((_, dayIndex) => {
              const day = weekDays[dayIndex];
              return (
                <div
                  key={dayIndex}
                  title={day ? day.toDateString() : ""}
                  className="w-3.5 h-3.5 m-0.5 rounded"
                  style={{
                    background: day
                      ? getColor(valueMap.get(day.toDateString()))
                      : "transparent",
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
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

function groupDaysIntoWeeks(daysArray: Date[]): (Date | undefined)[][] {
  const weeks: (Date | undefined)[][] = [];
  let week: (Date | undefined)[] = [];

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

function getColorFunctionBasedOnPercentile(valueMap: Map<string, number>) {
  const COLORS = [
    "#ebedf0",
    "#c6e48b",
    "#7bc96f",
    "#239a3b",
    "#196127",
    "#0e4429",
  ];

  // Extract all numeric values from the map and sort them in ascending order
  const values = Array.from(valueMap.values())
    .filter((v): v is number => typeof v === "number")
    .sort((a, b) => a - b);

  // gets the value at a given percentile
  const percentile = (p: number) =>
    values.length === 0
      ? 0
      : values[Math.floor((p / 100) * (values.length - 1))];

  const thresholds = [20, 40, 60, 80].map(percentile);

  const getColor = (value: number | undefined) => {
    switch (true) {
      case value === undefined:
        return COLORS[0];
      case value! <= thresholds[0]:
        return COLORS[1];
      case value! <= thresholds[1]:
        return COLORS[2];
      case value! <= thresholds[2]:
        return COLORS[3];
      case value! <= thresholds[3]:
        return COLORS[4];
      default:
        return COLORS[5];
    }
  };

  return getColor;
}
