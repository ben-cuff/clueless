import { ACTIVITY_FIELD_MAP, GOAL_TYPES_ARRAY } from "@/constants/goals";
import { prismaLib } from "@/lib/prisma";
import redisLib from "@/lib/redis";
import { Nullable, Optional } from "@/types/util";
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
  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);

  if (isNaN(userId)) {
    return get400Response("Invalid user ID");
  }

  const session = await getServerSession(authOptions);

  if (session?.user.id !== userId) {
    return ForbiddenError;
  }
  const cacheKey = `notifications:${userId}`;
  const notifications = await redisLib.lRange(cacheKey, 0, -1);

  if (notifications.length > 0) {
    redisLib.del(cacheKey);
    return get200Response({
      notify: true,
      notifications: notifications.map((n) => JSON.parse(n)),
    });
  }

  return get200Response({ notify: false });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const MAX_GOAL_PROGRESS_NOTIFICATIONS_IN_PERIOD = 3;
  let notificationsAdded = 0;

  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);

  if (isNaN(userId)) {
    return get400Response("Invalid user ID");
  }

  const session = await getServerSession(authOptions);

  if (session?.user.id !== userId) {
    return ForbiddenError;
  }

  const cacheKey = `notification_progress_${userId}`;

  const cachedNotificationCount = await redisLib.get(cacheKey);
  if (
    !cachedNotificationCount ||
    !(
      parseInt(cachedNotificationCount) >=
      MAX_GOAL_PROGRESS_NOTIFICATIONS_IN_PERIOD
    )
  ) {
    const notificationResult = await checkIfGoalProgressNotification(
      userId,
      cacheKey,
      cachedNotificationCount
    ).catch(() => {
      return UnknownServerError;
    });

    if (typeof notificationResult === "number") {
      notificationsAdded += notificationResult;
    }
  }

  return get200Response({
    notify: notificationsAdded > 0,
    notificationsAdded,
  });
}

async function checkIfGoalProgressNotification( userId: number, cacheKey: string, cachedNotificationCount: Nullable<string> ) {
  let goal;
  try {
    goal = await prismaLib.goal.findUnique({
      where: { userId },
    });
  } catch (error) {
    errorLog("Unexpected error: " + error);
    throw new Error("Unexpected error during goal retrieval");
  }

  if (!goal) {
    return 0;
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
    throw new Error("Unexpected error during activity retrieval");
  }

  const filteredActivities = filterActivitiesBeforeBeginAt(
    activityArray,
    new Date(goal.beginAt)
  );

  const timeProgressPercentage = getTimeProgressPercentage(
    new Date(goal.beginAt),
    endDate
  );

  const progressNotification = getProgressNotification(
    goal,
    filteredActivities,
    timeProgressPercentage
  );

  if (progressNotification) {
    if (cachedNotificationCount) {
      await redisLib.incr(cacheKey);
    } else {
      await redisLib.set(cacheKey, "1", {
        EX: secondsInDay,
      });
    }

    if (typeof progressNotification === "string") {
      await redisLib.publish(
        "notifications",
        JSON.stringify({
          text: progressNotification,
          type: "GOAL_PROGRESS",
          userId,
        })
      );
      return 1;
    }

    return 0;
}

function getProgressNotification(
  goal: Goal,
  filteredActivities: Activity[],
  timeProgressPercentage: number
): Optional<string> {
  for (const type of GOAL_TYPES_ARRAY) {
    if (goal.goalType === type && goal.value > 0) {
      const field = ACTIVITY_FIELD_MAP[type];
      const totalProgress = filteredActivities.reduce(
        (acc, activity) => acc + Number(activity[field]),
        0
      );
      return getProgressNotificationForGoalType(
        goal,
        totalProgress,
        timeProgressPercentage,
        type
      );
    }
  }
}

function getProgressNotificationForGoalType(
  goal: Goal,
  totalProgress: number,
  timeProgressPercentage: number,
  type: GoalType
): Optional<string> {
  const targetValue = goal.value;
  const MAX_AMOUNT_BEHIND = 10;

  if (targetValue == null) {
    return;
  }

  const progressPercentage = (totalProgress / targetValue) * 100;

  if (totalProgress >= targetValue) {
    return "Goal completed! Update it to get a new one.";
  }

  // if the user is 10% or more behind the time progress percentage, notify them
  if (progressPercentage < timeProgressPercentage - MAX_AMOUNT_BEHIND) {
    const deficit = Math.round(timeProgressPercentage - progressPercentage);

    const progressString = getProgressString(type, totalProgress, targetValue);

    const message =
      `You're falling behind on your goal by ${deficit}%!` +
      "\n" +
      progressString;
    return message;
  }
}

function getProgressString(
  type: GoalType,
  totalProgress: number,
  targetValue: Nullable<number>
): string {
  if (type === "SECOND") {
    const minutes = Math.floor(totalProgress / minutesInHour);
    const targetMinutes = Math.floor((targetValue ?? 0) / minutesInHour);
    return `Current progress: ${minutes}/${targetMinutes} minutes completed`;
  } else if (type === "QUESTION") {
    return `Current progress: ${totalProgress}/${targetValue} questions completed`;
  } else {
    return `Current progress: ${totalProgress}/${targetValue} completed`;
  }
}
