import { getDaysLeft } from '@/utils/activities-progress';
import { Company } from '@prisma/client';
import CompaniesList from '../companies-list';
import { CardDescription, CardHeader, CardTitle } from '../ui/card';

export default function GoalProgressHeader({
  beginAt,
  endDate,
  companies,
}: {
  beginAt: Date;
  endDate: Date;
  companies?: Company[];
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
        {companies && (
          <CompaniesList
            companies={companies}
            text="Targeted Companies: "
            className="font-bold"
          />
        )}
      </CardDescription>
    </CardHeader>
  );
}
