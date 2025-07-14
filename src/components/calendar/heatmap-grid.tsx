export default function HeatmapGrid({
  weeks,
  valueMap,
}: {
  weeks: (Date | undefined)[][];
  valueMap: Map<string, number>;
}) {
  const getColor = getColorFunctionBasedOnPercentile(valueMap);
  return (
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
  );
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
