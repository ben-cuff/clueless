import { prismaLib } from "@/lib/prisma";
import {
  filterActivitiesBeforeBeginAt,
  getTimeProgressPercentage,
} from "@/utils/activities-progress";
import {
  get200Response,
  get400Response,
  UnknownServerError,
} from "@/utils/api-responses";
import { Activity, Goal } from "@prisma/client";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);

  if (isNaN(userId)) {
    return get400Response("Invalid user ID");
  }
  let goal;
  try {
    goal = await prismaLib.goal.findUnique({
      where: { userId },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return UnknownServerError;
  }

  if (!goal) {
    return get200Response({ goal: null, progress: null });
  }

  const activities = await prismaLib.activity.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
  });

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
    goalType: goal.questions ? "questions" : "seconds",
  };

  if (goal.questions && goal.questions > 0) {
    const totalQuestions = filteredActivities.reduce(
      (acc, activity) => acc + (activity.questions ?? 0),
      0
    );
    progressData.totalProgress = totalQuestions;
    progressData.targetValue = goal.questions;
    progressData.progressPercentage = (totalQuestions / goal.questions) * 100;
  } else if (goal.seconds && goal.seconds > 0) {
    const totalSeconds = filteredActivities.reduce(
      (acc, activity) => acc + (activity.seconds ?? 0),
      0
    );
    progressData.totalProgress = totalSeconds;
    progressData.targetValue = goal.seconds;
    progressData.progressPercentage = (totalSeconds / goal.seconds) * 100;
  }

  return progressData;
}
