import { PrismaServerError } from '@/errors/prisma-error';
import { RedisServerError } from '@/errors/redis-error';
import { prismaLib } from '@/lib/prisma';
import redisLib from '@/lib/redis';
import { NotificationItem, NotificationType } from '@/types/notifications';
import { Activity } from '@prisma/client';
import { secondsInDay } from 'date-fns/constants';

/**
 * Handles global notifications by filtering out viewed notifications.
 * Also marks notifications as viewed in Redis.
 *
 * @param globalNotifications - The array of global notification strings.
 * @param userId - The ID of the user.
 * @param cacheKeyViewed - The Redis cache key for viewed notifications.
 * @returns The filtered global notifications.
 */
async function handleGlobalNotifications(
  globalNotifications: string[],
  userId: number,
  cacheKeyViewed: string
) {
  if (globalNotifications.length > 0) {
    const viewedNotificationsId = await getViewedNotifications(userId);

    let filtered: NotificationItem[] = [];

    // Filter out viewed notifications
    if (Array.isArray(viewedNotificationsId)) {
      filtered = globalNotifications
        .map((n) => {
          try {
            return JSON.parse(n);
          } catch {
            return null;
          }
        })
        .filter((n) => n && !viewedNotificationsId.includes(n.id));
    }

    // If there are any notifications, mark them as viewed
    if (filtered.length > 0) {
      await redisLib
        .lPush(
          cacheKeyViewed,
          filtered.map((n) => JSON.stringify(n))
        )
        .catch((error) => {
          throw new RedisServerError(
            'Failed to mark notifications as viewed: ' + error
          );
        });

      const ttl = await redisLib.ttl(cacheKeyViewed);
      if (ttl === -1) {
        await redisLib.expire(cacheKeyViewed, secondsInDay); // Set TTL to 1 day if not already set
      }
      return filtered;
    }
  }
  return [];
}

/**
 * Handles user-specific notifications by parsing and deleting them from Redis.
 *
 * @param userNotifications - The array of user notification strings.
 * @param cacheKeyUser - The Redis cache key for the user notifications.
 * @returns The parsed user notifications.
 */
async function handleUserNotifications(
  userNotifications: string[],
  cacheKeyUser: string
) {
  if (userNotifications.length > 0) {
    const parsed = userNotifications
      .map((n) => {
        try {
          return JSON.parse(n);
        } catch {
          return null;
        }
      })
      .filter((n) => n !== null);

    await redisLib.del(cacheKeyUser).catch((error) => {
      throw new RedisServerError(
        'Failed to delete user notifications: ' + error
      );
    });

    if (parsed.length > 0) {
      return parsed;
    }
  }
  return [];
}

async function getViewedNotifications(userId: number): Promise<string[]> {
  const cacheKeyViewed = `notifications:viewed:${userId}`;

  const viewedNotifications = await redisLib
    .lRange(cacheKeyViewed, 0, -1)
    .catch((error) => {
      throw new RedisServerError(
        'Failed to fetch viewed notifications: ' + error
      );
    });

  if (Array.isArray(viewedNotifications)) {
    return parseNotificationIds(viewedNotifications);
  }

  return [];
}

function parseNotificationIds(viewedNotifications: string[]): string[] {
  return viewedNotifications
    .map((n) => {
      try {
        const parsed = JSON.parse(n);
        return parsed.id;
      } catch {
        return null;
      }
    })
    .filter((id) => id != null);
}

async function checkIfStreakNotification(userId: number) {
  const MIN_NUM_DAYS_FOR_STREAK = 2;
  let activity: Activity[];

  try {
    activity = await prismaLib.activity.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  } catch (error) {
    throw new PrismaServerError('Failed to fetch activity data: ' + error);
  }

  if (!activity || activity.length === 0) {
    return false;
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
        'notifications',
        JSON.stringify({
          text: progressNotification,
          type: NotificationType.STREAK,
          userId,
        })
      )
      .catch((error) => {
        throw new RedisServerError(
          'Failed to publish streak notification: ' + error
        );
      });
    return true;
  }

  return false;
}

export {
  checkIfStreakNotification,
  getViewedNotifications,
  handleGlobalNotifications,
  handleUserNotifications,
  parseNotificationIds,
};
