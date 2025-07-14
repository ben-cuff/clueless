import { ACTIVITY_FIELD_MAP, GOAL_TYPES_ARRAY } from "@/constants/goals";
import { prismaLib } from "@/lib/prisma";
import redisLib from "@/lib/redis";
import {
  filterActivitiesBeforeBeginAt,
  getTimeProgressPercentage,
} from "@/utils/activities-progress";
import {
  ForbiddenError,
  get200Response,
  get400Response,
  UnknownServerError,
} from "@/utils/api-responses";
import { errorLog } from "@/utils/logger";
import { Activity, Goal, GoalType } from "@prisma/client";
import { minutesInHour, secondsInDay } from "date-fns/constants";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const MAX_NOTIFICATIONS_IN_PERIOD = 3;

  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);

  if (isNaN(userId)) {
    return get400Response("Invalid user ID");
  }

  const session = await getServerSession(authOptions);

  if (session?.user.id !== userId) {
    return ForbiddenError;
  }

  const cacheKey = `notification_${userId}`;

  const cachedNotificationCount = await redisLib.get(cacheKey);
  if (
    cachedNotificationCount &&
    parseInt(cachedNotificationCount) >= MAX_NOTIFICATIONS_IN_PERIOD
  ) {
    return get200Response({ notify: false });
  }

  let goal;
  try {
    goal = await prismaLib.goal.findUnique({
      where: { userId },
    });
  } catch (error) {
    errorLog("Unexpected error: " + error);
    return UnknownServerError;
  }

  if (!goal) {
    return get200Response({ notify: false });
  }

  const endDate = new Date(goal.endDate);

  let activityArray;

  try {
    activityArray = await prismaLib.activity.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: "desc",
      },
    });
  } catch (error) {
    errorLog("Unexpected error: " + error);
    return UnknownServerError;
  }

  const filteredActivities = filterActivitiesBeforeBeginAt(
    activityArray,
    new Date(goal.beginAt)
  );

  const timeProgressPercentage = getTimeProgressPercentage(
    new Date(goal.beginAt),
    endDate
  );

  const notification = getNotification(
    goal,
    filteredActivities,
    timeProgressPercentage
  );

  if (notification) {
    if (cachedNotificationCount) {
      await redisLib.incr(cacheKey);
    } else {
      await redisLib.set(cacheKey, "1", {
        EX: secondsInDay,
      });
    }
    return notification;
  } else {
    return get200Response({ notify: false });
  }
}

function getNotification(
  goal: Goal,
  filteredActivities: Activity[],
  timeProgressPercentage: number
): Response | undefined {
  for (const type of GOAL_TYPES_ARRAY) {
    if (goal.goalType === type && goal.value > 0) {
      const field = ACTIVITY_FIELD_MAP[type];
      const totalProgress = filteredActivities.reduce(
        (acc, activity) => acc + Number(activity[field]),
        0
      );
      return getNotificationForGoalType(
        goal,
        totalProgress,
        timeProgressPercentage,
        type
      );
    }
  }
}

function getNotificationForGoalType(
  goal: Goal,
  totalProgress: number,
  timeProgressPercentage: number,
  type: GoalType
): Response | undefined {
  const targetValue = goal.value;
  const MAX_AMOUNT_BEHIND = 10;

  if (targetValue == null) {
    return get400Response(`${type} must be provided`);
  }

  const progressPercentage = (totalProgress / targetValue) * 100;

  if (totalProgress >= targetValue) {
    return get200Response({
      notify: true,
      message: "Goal completed! Update it to get a new one.",
    });
  }

  // if the user is 10% or more behind the time progress percentage, notify them
  if (progressPercentage < timeProgressPercentage - MAX_AMOUNT_BEHIND) {
    const deficit = Math.round(timeProgressPercentage - progressPercentage);

    const progressString = getProgressString(type, totalProgress, targetValue);

    const message =
      `You're falling behind on your goal by ${deficit}%!` +
      "\n" +
      progressString;
    return get200Response({ notify: true, message });
  }
}

function getProgressString(
  type: GoalType,
  totalProgress: number,
  targetValue: number | null
): string {
  if (type === "SECOND") {
    const minutes = Math.floor(totalProgress / 60);
    const targetMinutes = Math.floor((targetValue ?? 0) / minutesInHour);
    return `Current progress: ${minutes}/${targetMinutes} minutes completed`;
  } else if (type === "QUESTION") {
    return `Current progress: ${totalProgress}/${targetValue} questions completed`;
  } else {
    return `Current progress: ${totalProgress}/${targetValue} completed`;
  }
}
