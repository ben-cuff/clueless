import { prismaLib } from "@/lib/prisma";
import redisLib from "@/lib/redis";
import {
  ForbiddenError,
  get200Response,
  get400Response,
  UnknownServerError,
} from "@/utils/api-responses";
import { checkIfGoalProgressNotification } from "@/utils/goal-progress";
import { errorLog } from "@/utils/logger";
import { Activity } from "@prisma/client";
import { secondsInDay, secondsInHour } from "date-fns/constants";
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

  const cacheKeyProgress = `notification_progress_${userId}`;
  const cacheKeyProgressLastSent = `notification_progress_last_sent_${userId}`;

  const cachedNotificationCount = (await redisLib
    .get(cacheKeyProgress)
    .catch(() => {
      return UnknownServerError;
    })) as string;

  // Is there a notification in the last 2 hours?
  const lastSentProgressNotification = await redisLib
    .get(cacheKeyProgressLastSent)
    .catch(() => {
      return UnknownServerError;
    });

  // Check if we have already sent the max number of progress notifications in a period
  const hasSentMaxProgressNotification =
    cachedNotificationCount &&
    parseInt(cachedNotificationCount) >=
      MAX_GOAL_PROGRESS_NOTIFICATIONS_IN_PERIOD;

  if (!hasSentMaxProgressNotification && !lastSentProgressNotification) {
    const notificationResult = await checkIfGoalProgressNotification(
      userId,
      cacheKeyProgress,
      cachedNotificationCount
    ).catch(() => {
      return UnknownServerError;
    });

    if (typeof notificationResult === "number" && notificationResult > 0) {
      notificationsAdded += notificationResult;
      await redisLib.set(cacheKeyProgressLastSent, "1", {
        EX: secondsInHour * 2, // Only allow progress notifications every 2 hours
      });
    }
  }

  const cacheKeyStreak = `notification_streak_${userId}`;
  const cachedStreakNotification = await redisLib
    .get(cacheKeyStreak)
    .catch(() => {
      return UnknownServerError;
    });

  if (!cachedStreakNotification) {
    const notificationStreak = await checkIfStreakNotification(userId).catch(
      () => {
        return UnknownServerError;
      }
    );

    if (typeof notificationStreak === "number") {
      notificationsAdded += notificationStreak;
    }
    await redisLib.set(cacheKeyStreak, "1", { EX: secondsInDay }); // Only send 1 streak notification per day
  }

  return get200Response({
    notify: notificationsAdded > 0,
    notificationsAdded,
  });
}

async function checkIfStreakNotification(userId: number) {
  const MIN_NUM_DAYS_FOR_STREAK = 2;
  let activity: Activity[];

  try {
    activity = await prismaLib.activity.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
  } catch (error) {
    errorLog("Error fetching activity for streak notification: " + error);
    throw new Error("Failed to fetch activity data");
  }

  if (!activity || activity.length === 0) {
    return 0;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  const currentDate = new Date(today);
  for (const act of activity) {
    const actDate = new Date(act.date);
    actDate.setHours(0, 0, 0, 0);

    if (streak === 0) {
      if (actDate.getTime() !== currentDate.getTime()) {
        break;
      }
    } else {
      currentDate.setDate(currentDate.getDate() - 1);
      if (actDate.getTime() !== currentDate.getTime()) {
        break;
      }
    }

    if (act.questions > 0) {
      streak++;
    } else {
      break;
    }
  }

  if (streak >= MIN_NUM_DAYS_FOR_STREAK) {
    const progressNotification = `🔥 You're on a ${streak}-day streak! Keep it up!`;
    await redisLib
      .publish(
        "notifications",
        JSON.stringify({
          text: progressNotification,
          type: "STREAK",
          userId,
        })
      )
      .catch((error) => {
        errorLog("Error publishing streak notification: " + error);
        throw new Error("Failed to publish streak notification");
      });
    return 1;
  }

  return 0;
}
