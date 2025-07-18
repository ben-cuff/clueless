import { getDaysLeft } from '@/utils/activities-progress';
import { CardDescription, CardHeader, CardTitle } from '../ui/card';

export default function GoalProgressHeader({
  beginAt,
  endDate,
}: {
  beginAt: Date;
  endDate: Date;
}) {
  return (
    <CardHeader>
      <CardTitle className="text-2xl">Goal Progress</CardTitle>
      <CardDescription className="flex flex-col gap-1 mt-2">
        <span>Goal starts: {new Date(beginAt).toLocaleDateString()}</span>
        <span>Goal ends: {new Date(endDate).toLocaleDateString()}</span>
        <span className="text-xl">
          Days left: {Math.floor(getDaysLeft(endDate))}
        </span>
      </CardDescription>
    </CardHeader>
  );
}
