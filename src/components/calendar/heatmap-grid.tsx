import { Optional } from '@/types/util';

export default function HeatmapGrid({
  weeks,
  valueMap,
}: {
  weeks: Optional<Date>[][];
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
                title={day ? day.toDateString() : ''}
                className="w-3.5 h-3.5 m-0.5 rounded"
                style={{
                  background: day
                    ? getColor(valueMap.get(day.toDateString()))
                    : 'transparent',
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
  const COLORS = {
    BRIGHT_GRAY: '#ebedf0',
    YELLOW_GREEN: '#c6e48b',
    MANTIS: '#7bc96f',
    FOREST_GREEN: '#239a3b',
    CAL_POLY_POMONA_GREEN: '#196127',
    BRITISH_RACING_GREEN: '#0e4429',
  };

  // Extract all numeric values from the map and sort them in ascending order
  const values = Array.from(valueMap.values())
    .filter((v): v is number => typeof v === 'number')
    .sort((a, b) => a - b);

  // gets the value at a given percentile
  const percentile = (p: number) =>
    values.length === 0
      ? 0
      : values[Math.floor((p / 100) * (values.length - 1))];

  const thresholds = [20, 40, 60, 80].map(percentile);

  const getColor = (value: Optional<number>) => {
    switch (true) {
      case value === undefined:
        return COLORS.BRIGHT_GRAY;
      case value! <= thresholds[0]:
        return COLORS.YELLOW_GREEN;
      case value! <= thresholds[1]:
        return COLORS.MANTIS;
      case value! <= thresholds[2]:
        return COLORS.FOREST_GREEN;
      case value! <= thresholds[3]:
        return COLORS.CAL_POLY_POMONA_GREEN;
      default:
        return COLORS.BRITISH_RACING_GREEN;
    }
  };

  return getColor;
}
