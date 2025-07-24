import { prismaLib } from '@/lib/prisma';
import {
  filterActivitiesBeforeBeginAt,
  getTimeProgressPercentage,
} from '@/utils/activities-progress';
import { ActivityAPI, handleActivityAPIError } from '@/utils/activity-api';
import {
  get200Response,
  get400Response,
  UnknownServerError,
} from '@/utils/api-responses';
import { errorLog } from '@/utils/logger';
import { Activity, Goal, GoalType } from '@prisma/client';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);

  if (isNaN(userId)) {
    return get400Response('Invalid user ID');
  }

  let goal;
  try {
    goal = await prismaLib.goal.findUnique({
      where: { userId },
    });
  } catch (error) {
    errorLog(
      'Unexpected error while getting user progress towards goal: ' + error
    );
    return UnknownServerError;
  }

  if (!goal) {
    return get200Response({ goal: null, progress: null });
  }

  let activities: Activity[] = [];
  try {
    activities = (await ActivityAPI.getActivity(userId)) ?? [];
  } catch (error) {
    handleActivityAPIError(error as Error);
  }

  const filteredActivities = filterActivitiesBeforeBeginAt(
    activities,
    new Date(goal.beginAt)
  );

  const timeProgressPercentage = getTimeProgressPercentage(
    new Date(goal.beginAt),
    new Date(goal.endDate)
  );

  const progressData = getProgressData(
    timeProgressPercentage,
    goal,
    filteredActivities
  );

  return get200Response({ goal, progress: progressData });
}

function getProgressData(
  timeProgressPercentage: number,
  goal: Goal,
  filteredActivities: Activity[]
) {
  const progressData = {
    timeProgressPercentage,
    progressPercentage: 0,
    totalProgress: 0,
    targetValue: 0,
    goalType: goal.goalType,
  };

  if (goal.goalType === GoalType.QUESTION && goal.value > 0) {
    const totalQuestions = filteredActivities.reduce(
      (acc, activity) => acc + (activity.questions ?? 0),
      0
    );
    progressData.totalProgress = totalQuestions;
    progressData.targetValue = goal.value;
    progressData.progressPercentage = (totalQuestions / goal.value) * 100;
  } else if (goal.goalType === GoalType.SECOND && goal.value > 0) {
    const totalSeconds = filteredActivities.reduce(
      (acc, activity) => acc + (activity.seconds ?? 0),
      0
    );
    progressData.totalProgress = totalSeconds;
    progressData.targetValue = goal.value;
    progressData.progressPercentage = (totalSeconds / goal.value) * 100;
  }

  return progressData;
}
