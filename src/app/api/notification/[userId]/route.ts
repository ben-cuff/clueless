import redisLib from "@/lib/redis";
import { NotificationItem } from "@/types/notifications";
import {
  ForbiddenError,
  get200Response,
  get400Response,
  UnknownServerError,
} from "@/utils/api-responses";
import { checkIfGoalProgressNotification } from "@/utils/goal-progress";
import { errorLog } from "@/utils/logger";
import {
  checkIfStreakNotification,
  handleGlobalNotifications,
  handleUserNotifications,
} from "@/utils/notification-helpers";
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

  const cacheKeyUser = `notifications:${userId}`;
  const cacheKeyGlobal = `notifications:global`;
  const cacheKeyViewed = `notifications:viewed:${userId}`;

  let userNotifications: string[] = [];
  let globalNotifications: string[] = [];

  try {
    userNotifications = await redisLib.lRange(cacheKeyUser, 0, -1); // Fetch user notifications
  } catch (error) {
    errorLog("Error fetching user notifications: " + error);
    return UnknownServerError;
  }

  try {
    globalNotifications = await redisLib.lRange(cacheKeyGlobal, 0, -1); // Fetch global notifications
  } catch (error) {
    errorLog("Error fetching global notifications: " + error);
    return UnknownServerError;
  }

  let allNotifications: NotificationItem[] = [];

  try {
    allNotifications = allNotifications.concat(
      await handleUserNotifications(userNotifications, cacheKeyUser) // parse user notifications and delete
    );
  } catch (error) {
    errorLog("Error handling user notifications: " + error);
    return UnknownServerError;
  }

  try {
    allNotifications = allNotifications.concat(
      await handleGlobalNotifications(
        globalNotifications,
        userId,
        cacheKeyViewed
      ) // parse global notifications and mark as viewed
    );
  } catch (error) {
    errorLog("Error handling global notifications: " + error);
    return UnknownServerError;
  }

  if (allNotifications.length > 0) {
    return get200Response({
      notify: true,
      notifications: allNotifications,
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

  let cachedNotificationCount;
  try {
    cachedNotificationCount = (await redisLib.get(cacheKeyProgress)) as string;
  } catch {
    return UnknownServerError;
  }

  // Is there a notification in the last 2 hours?
  let lastSentProgressNotification;
  try {
    lastSentProgressNotification = await redisLib.get(cacheKeyProgressLastSent);
  } catch {
    return UnknownServerError;
  }

  // Check if we have already sent the max number of progress notifications in a period
  const hasSentMaxProgressNotification =
    cachedNotificationCount &&
    parseInt(cachedNotificationCount) >=
      MAX_GOAL_PROGRESS_NOTIFICATIONS_IN_PERIOD;

  if (!hasSentMaxProgressNotification && !lastSentProgressNotification) {
    let notificationResult;
    try {
      notificationResult = await checkIfGoalProgressNotification(
        userId,
        cacheKeyProgress,
        cachedNotificationCount
      );
    } catch (error) {
      errorLog("Error checking goal progress notification: " + error);
      return UnknownServerError;
    }
    if (notificationResult) {
      notificationsAdded += 1;
      try {
        await redisLib.set(cacheKeyProgressLastSent, "1", {
          EX: secondsInHour * 2, // Only allow progress notifications every 2 hours
        });
      } catch (error) {
        errorLog("Error setting progress notification last sent: " + error);
        return UnknownServerError;
      }
    }
  }

  const cacheKeyStreak = `notification_streak_${userId}`;
  let cachedStreakNotification;
  try {
    cachedStreakNotification = await redisLib.get(cacheKeyStreak);
  } catch (error) {
    errorLog("Error fetching cached streak notification: " + error);
    return UnknownServerError;
  }

  // Check if we have already sent a streak notification today
  if (!cachedStreakNotification) {
    let notificationStreak;
    try {
      notificationStreak = await checkIfStreakNotification(userId);
    } catch (error) {
      errorLog("Error checking streak notification: " + error);
      return UnknownServerError;
    }

    if (notificationStreak) {
      notificationsAdded += 1;
    }

    try {
      await redisLib.set(cacheKeyStreak, "1", { EX: secondsInDay });
    } catch (error) {
      errorLog("Error setting streak notification cache: " + error);
      return UnknownServerError;
    }
  }

  return get200Response({
    notify: notificationsAdded > 0,
    notificationsAdded,
  });
}
