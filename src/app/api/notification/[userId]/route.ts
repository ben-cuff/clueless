import { SECONDS_IN_A_DAY } from "@/constants/time";
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
import { Activity, Goal } from "@prisma/client";
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
    console.error("Unexpected error:", error);
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
    console.error("Unexpected error:", error);
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
        EX: SECONDS_IN_A_DAY,
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
  if (goal.questions && goal.questions > 0) {
    const totalQuestions = filteredActivities.reduce(
      (acc, activity) => acc + (activity.questions ?? 0),
      0
    );

    return getNotificationForGoalType(
      goal,
      totalQuestions,
      timeProgressPercentage,
      "questions"
    );
  }

  if (goal.seconds && goal.seconds > 0) {
    const totalSeconds = filteredActivities.reduce(
      (acc, activity) => acc + (activity.seconds ?? 0),
      0
    );

    return getNotificationForGoalType(
      goal,
      totalSeconds,
      timeProgressPercentage,
      "seconds"
    );
  }
}

function getNotificationForGoalType(
  goal: Goal,
  totalProgress: number,
  timeProgressPercentage: number,
  type: "seconds" | "questions"
): Response | undefined {
  const targetValue = type === "seconds" ? goal.seconds : goal.questions;

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
  if (progressPercentage < timeProgressPercentage - 10) {
    const message =
      type === "seconds"
        ? "You're falling behind on your study time goal!"
        : "You're falling behind on your questions goal!";
    return get200Response({ notify: true, message });
  }
}
