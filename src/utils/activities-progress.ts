import { Activity } from '@prisma/client';
import { millisecondsInDay } from 'date-fns/constants';

function filterActivitiesBeforeBeginAt(
  activities: Activity[],
  beginAt: Date
): Activity[] {
  return activities.filter((activity) => {
    const activityDate = new Date(activity.date);
    const adjustedBeginAt = new Date(beginAt);
    adjustedBeginAt.setDate(adjustedBeginAt.getDate() - 1);

    return activityDate.getTime() >= adjustedBeginAt.getTime();
  });
}

function getTimeProgressPercentage(beginAt: Date, endDate: Date): number {
  endDate.setHours(23, 59, 59, 999); // Set endDate to the end of the day
  const totalDuration = endDate.getTime() - beginAt.getTime();
  const elapsedDuration = new Date().getTime() - beginAt.getTime();
  return Math.max(0, Math.min(100, (elapsedDuration / totalDuration) * 100));
}

function getDaysLeft(endDate: Date): number {
  return Math.max(
    0,
    Math.ceil(new Date(endDate).getTime() - new Date().setHours(0, 0, 0, 0)) /
      millisecondsInDay
  );
}

export {
  filterActivitiesBeforeBeginAt,
  getDaysLeft,
  getTimeProgressPercentage,
};
