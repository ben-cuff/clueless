import { ACTIVITY_FIELD_MAP } from '@/constants/goals';
import { PrismaServerError } from '@/errors/prisma-error';
import { RedisServerError } from '@/errors/redis-error';
import { prismaLib } from '@/lib/prisma';
import redisLib from '@/lib/redis';
import { NotificationType } from '@/types/notifications';
import { Nullable, Optional } from '@/types/util';
import { Activity, Goal, GoalType } from '@prisma/client';
import { minutesInHour, secondsInDay } from 'date-fns/constants';
import {
  filterActivitiesBeforeBeginAt,
  getTimeProgressPercentage,
} from './activities-progress';

async function checkIfGoalProgressNotification(
  userId: number,
  cacheKey: string,
  cachedNotificationCount: Nullable<string>
) {
  let goal;
  try {
    goal = await prismaLib.goal.findUnique({
      where: { userId },
    });
  } catch (error) {
    throw new PrismaServerError(
      'Unexpected error during goal retrieval: ' + error
    );
  }

  if (!goal) {
    return false;
  }

  const endDate = new Date(goal.endDate);

  let activityArray;

  try {
    activityArray = await prismaLib.activity.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: 'desc',
      },
    });
  } catch (error) {
    throw new PrismaServerError(
      'Unexpected error during activity retrieval: ' + error
    );
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
    try {
      if (cachedNotificationCount) {
        await redisLib.incr(cacheKey);
      } else {
        await redisLib.set(cacheKey, '1', {
          EX: secondsInDay,
        });
      }
    } catch (error) {
      throw new RedisServerError(
        'Failed to set or increment goal progress notification cache: ' + error
      );
    }

    await redisLib
      .publish(
        'notifications',
        JSON.stringify({
          text: progressNotification,
          type: NotificationType.GOAL_PROGRESS,
          userId,
        })
      )
      .catch((error) => {
        throw new RedisServerError(
          'Failed to publish goal progress notification: ' + error
        );
      });

    return true;
  }

  return false;
}

function getProgressNotification(
  goal: Goal,
  filteredActivities: Activity[],
  timeProgressPercentage: number
): Optional<string> {
  for (const type of Object.values(GoalType)) {
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
    return 'Goal completed! Update it to get a new one.';
  }

  // if the user is 10% or more behind the time progress percentage, notify them
  if (progressPercentage < timeProgressPercentage - MAX_AMOUNT_BEHIND) {
    const deficit = Math.round(timeProgressPercentage - progressPercentage);

    const progressString = getProgressString(type, totalProgress, targetValue);

    const message =
      `You're falling behind on your goal by ${deficit}%!` +
      '\n' +
      progressString;
    return message;
  }
}

function getProgressString(
  type: GoalType,
  totalProgress: number,
  targetValue: Nullable<number>
): string {
  if (type === GoalType.SECOND) {
    const minutes = Math.floor(totalProgress / minutesInHour);
    const targetMinutes = Math.floor((targetValue ?? 0) / minutesInHour);
    return `Current progress: ${minutes}/${targetMinutes} minutes completed`;
  } else if (type === GoalType.QUESTION) {
    return `Current progress: ${totalProgress}/${targetValue} questions completed`;
  } else {
    return `Current progress: ${totalProgress}/${targetValue} completed`;
  }
}

export { checkIfGoalProgressNotification };
