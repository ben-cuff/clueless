import { Optional } from "@/types/util";

export default function MonthLabels({ weeks }: { weeks: Optional<Date>[][] }) {
  const monthLabels = getMonthLabels(weeks);

  return (
    <div className="flex flex-row mb-1">
      {weeks.map((_, weekIndex) => {
        const label =
          monthLabels.find((ml) => ml.index === weekIndex)?.label ?? "";
        return (
          <div key={weekIndex} className="text-xs w-4.5">
            {label}
          </div>
        );
      })}
    </div>
  );
}

function getMonthLabels(weeks: Optional<Date>[][]) {
  const monthLabels: { index: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const firstDay = week.find(Boolean) as Optional<Date>;
    if (firstDay) {
      const month = firstDay.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({
          index: i,
          label: firstDay.toLocaleString("default", { month: "short" }),
        });
        lastMonth = month;
      }
    }
  });
  return monthLabels;
}
