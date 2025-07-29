/**
 * This file contains the API route for handling notifications for a specific user.
 * There are two main types of notifications:
 * 1. User-specific notifications
 * 2. Global notifications
 *
 * There are further 2 major user specific notifications:
 * 1. Goal progress notifications
 * 2. Streak notifications
 *
 * Goal progress notifications are designed to be send at most 3 times per day, and no more than once every 2 hours.
 * Streak notifications are designed to be sent once per day, if the user has a streak.
 *
 * For global notifications, they are sent to all users and are not user-specific.
 *
 * The GET method retrieves the notifications for a user as well as checking if there are any global notifications.
 * It also checks if the user has already viewed the global notification, as these cannot be deleted after being viewed.
 * Global notifications are stored for 1 day and if the user has not viewed them after they expire, they will never see them.
 *
 * The POST method is used to trigger the notifications based on the user's progress and streak.
 * It checks if the user has made progress on their goals or if they have a streak, and publishes the notifications to the notification worker.
 */

import { PrismaServerError } from '@/errors/prisma-error';
import { RedisServerError } from '@/errors/redis-error';
import redisLib from '@/lib/redis';
import { NotificationItem } from '@/types/notifications';
import {
  ForbiddenError,
  get200Response,
  get400Response,
  get500Response,
  UnknownServerError,
} from '@/utils/api/api-responses';
import { checkIfGoalProgressNotification } from '@/utils/goal-progress';
import { errorLog } from '@/utils/logger';
import {
  checkIfStreakNotification,
  handleGlobalNotifications,
  handleUserNotifications,
} from '@/utils/notification-helpers';
import { secondsInDay, secondsInHour } from 'date-fns/constants';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);

  if (isNaN(userId)) {
    return get400Response('Invalid user ID');
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
    errorLog('Error fetching user notifications: ' + error);
    return UnknownServerError;
  }

  try {
    globalNotifications = await redisLib.lRange(cacheKeyGlobal, 0, -1); // Fetch global notifications
  } catch (error) {
    errorLog('Error fetching global notifications: ' + error);
    return UnknownServerError;
  }

  let allNotifications: NotificationItem[] = [];

  try {
    allNotifications = allNotifications.concat(
      await handleUserNotifications(userNotifications, cacheKeyUser) // parse user notifications and delete
    );
  } catch (error) {
    errorLog('Error handling user notifications: ' + error);
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
    if (error instanceof RedisServerError) {
      errorLog('Error handling global notifications: ' + error.message);
      return get500Response(
        'A redis error occurred while handling global notifications.'
      );
    }
    errorLog('Error handling global notifications: ' + error);
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
    return get400Response('Invalid user ID');
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
      if (error instanceof PrismaServerError) {
        errorLog('Error checking goal progress notification: ' + error.message);
        return get500Response(
          'A prisma database error occurred while checking goal progress notification.'
        );
      } else if (error instanceof RedisServerError) {
        errorLog('Error checking goal progress notification: ' + error.message);
        return get500Response(
          'A redis database error occurred while checking goal progress notification.'
        );
      }
      return UnknownServerError;
    }
    if (notificationResult) {
      notificationsAdded += 1;
      try {
        await redisLib.set(cacheKeyProgressLastSent, '1', {
          expiration: { type: 'EX', value: secondsInHour * 2 },
        });
      } catch (error) {
        errorLog('Error setting progress notification last sent: ' + error);
        return UnknownServerError;
      }
    }
  }

  const cacheKeyStreak = `notification_streak_${userId}`;
  let cachedStreakNotification;
  try {
    cachedStreakNotification = await redisLib.get(cacheKeyStreak);
  } catch (error) {
    errorLog('Error fetching cached streak notification: ' + error);
    return UnknownServerError;
  }

  // Check if we have already sent a streak notification today
  if (!cachedStreakNotification) {
    let notificationStreak;
    try {
      notificationStreak = await checkIfStreakNotification(userId);
    } catch (error) {
      if (error instanceof PrismaServerError) {
        errorLog('Error checking streak notification: ' + error.message);
        return get500Response(
          'A prisma database error occurred while checking streak notification.'
        );
      } else if (error instanceof RedisServerError) {
        errorLog('Error checking streak notification: ' + error.message);
        return get500Response(
          'A redis database error occurred while checking streak notification.'
        );
      }
      errorLog('Error checking streak notification: ' + error);
      return UnknownServerError;
    }

    if (notificationStreak) {
      notificationsAdded += 1;
    }

    try {
      await redisLib.set(cacheKeyStreak, '1', {
        expiration: { type: 'EX', value: secondsInDay },
      });
    } catch (error) {
      errorLog('Error setting streak notification cache: ' + error);
      return UnknownServerError;
    }
  }

  return get200Response({
    notify: notificationsAdded > 0,
    notificationsAdded,
  });
}
