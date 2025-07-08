import { Activity } from "@prisma/client";

function filterActivitiesBeforeBeginAt(
  activities: Activity[],
  beginAt: Date
): Activity[] {
  return activities.filter((activity) => {
    const activityDate = new Date(activity.date);
    const goalBeginDate = new Date(beginAt);
    goalBeginDate.setDate(goalBeginDate.getDate() - 1); // Adjust goal begin date to include activities on the same day

    // checks if the activity date is on or after the goal's begin date (activity on same day is included)
    return (
      activityDate.getDay() >= goalBeginDate.getDay() &&
      activityDate.getMonth() >= goalBeginDate.getMonth() &&
      activityDate.getFullYear() >= goalBeginDate.getFullYear()
    );
  });
}

function getTimeProgressPercentage(beginAt: Date, endDate: Date): number {
  const totalDuration = endDate.getTime() - beginAt.getTime();
  const elapsedDuration = new Date().getTime() - beginAt.getTime();
  return Math.max(0, Math.min(100, (elapsedDuration / totalDuration) * 100));
}

export { filterActivitiesBeforeBeginAt, getTimeProgressPercentage };
