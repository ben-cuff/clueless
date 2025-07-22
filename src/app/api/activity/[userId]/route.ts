/**
 * This file handles API routes for tracking user activity.
 * It allows for fetching and updating user activity data, such as time spent on tasks and questions answered.
 *
 * The GET method retrieves the activity for a specific user, checking if the latest activity is completed and updating it if necessary.
 * The POST method allows for adding new activity data, such as the number of questions answered and time spent.
 *
 * It uses the cluelessInteractionsLib to fetch user interactions and calculate the total time spent on tasks.
 * A user is considered "active" on the site and their activity is recorded if they are on the
 * interview page and have made interactions with the code editor or other relevant components.
 *
 * The tracking of interactions allows going back and calculating total time spent using different constants for
 * things like MAX_TIME_ADDED, which is the maximum time added for each interaction.
 */

import INTERACTION_NAMES from '@/constants/interaction-names';
import { cluelessInteractionsLib } from '@/lib/interactions';
import { prismaLib } from '@/lib/prisma';
import { ActivityAPI } from '@/utils/activity-api';
import {
  get200Response,
  get201Response,
  get400Response,
  UnknownServerError,
} from '@/utils/api-responses';
import { errorLog } from '@/utils/logger';
import { Activity, GoalType, Prisma } from '@prisma/client';
import { millisecondsInSecond } from 'date-fns/constants';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);

  if (isNaN(userId)) {
    return get400Response('Invalid user ID');
  }

  try {
    const activities = await prismaLib.activity.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: 'desc',
      },
    });

    // if the latest activity is completed, then we know we are on a new day
    if (activities[0]?.completed) {
      const mostRecentActivity = await ActivityAPI.updateActivity(
        userId,
        GoalType.SECOND
      );

      if (mostRecentActivity) {
        activities.unshift(mostRecentActivity);
      }
    }

    const updatedActivities = await Promise.all(
      activities.map((activity) => {
        return getUpdatedActivity(activity);
      })
    );

    return get200Response(updatedActivities);
  } catch (error) {
    errorLog('Unexpected error: ' + error);
    return UnknownServerError;
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);

  if (isNaN(userId)) {
    return get400Response('Invalid user ID');
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return get400Response('Invalid JSON body');
  }
  const { questions } = body;

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  let existingActivity;
  try {
    existingActivity = await prismaLib.activity.findUnique({
      where: {
        userId_date: {
          userId,
          date: currentDate,
        },
      },
    });
  } catch (error) {
    errorLog('Error fetching existing activity:' + error);
    return UnknownServerError;
  }

  const updatedQuestions =
    questions === true ? (existingActivity?.questions ?? 0) + 1 : undefined;

  const updatedSeconds = await getActivityForUser(userId, currentDate);

  const update = {
    questions: updatedQuestions,
    seconds: updatedSeconds,
  };

  const create = {
    userId,
    date: currentDate,
    questions: updatedQuestions,
    seconds: updatedSeconds,
  };

  try {
    const activity = await prismaLib.activity.upsert({
      where: {
        userId_date: {
          userId,
          date: currentDate,
        },
      },
      update,
      create,
    });

    const isNewRecord =
      activity.createdAt.getTime() === activity.updatedAt.getTime();

    return isNewRecord ? get201Response(activity) : get200Response(activity);
  } catch (error) {
    errorLog('Error adding activity: ' + error);
    return UnknownServerError;
  }
}

// gets the start and end of the day for a given date
function getDayRange(date: Date): { from: Date; to: Date } {
  const from = new Date(date);
  from.setHours(0, 0, 0, 0);
  const to = new Date(date);
  to.setHours(23, 59, 59, 999);
  return { from, to };
}

/**
 * fetches valid interactions for a user on a specific date
 * filters by pathname prefix and qualifying events
 */
async function fetchUserInteractions(
  userId: number,
  date: Date
): Promise<InteractionEvent[]> {
  const PATHNAME_PREFIX = '/interview/';
  const QUALIFYING_EVENTS = [
    INTERACTION_NAMES.button.submitChatMessage,
    INTERACTION_NAMES.button.runTestCases,
    INTERACTION_NAMES.textarea.chatInput,
    INTERACTION_NAMES.codeEditor,
  ];

  const { from, to } = getDayRange(date);
  try {
    return await cluelessInteractionsLib.queryEvents(
      {
        context: [
          {
            contextField: 'userId',
            contextValue: userId,
          },
          {
            contextField: 'pathname',
            contextValue: PATHNAME_PREFIX,
            operation: { string_starts_with: PATHNAME_PREFIX },
          },
        ],
        from,
        to,
        event: QUALIFYING_EVENTS,
      },
      { order: 'asc' }
    );
  } catch (error) {
    errorLog('Error fetching interactions: ' + error);
    return [];
  }
}

// calculates total time spent based on interactions
function calculateTotalTime(interactions: InteractionEvent[]): number {
  const MAX_TIME_ADDED = 60; // cap each interval at 60 seconds

  let totalTime = 0;
  for (let i = 1; i < interactions.length; i++) {
    const prev = new Date(interactions[i - 1].timestamp).getTime();
    const curr = new Date(interactions[i].timestamp).getTime();
    const diffSeconds = Math.floor((curr - prev) / millisecondsInSecond);
    if (diffSeconds > 0) {
      totalTime += Math.min(diffSeconds, MAX_TIME_ADDED);
    }
  }
  return totalTime;
}

async function getActivityForUser(userId: number, date: Date): Promise<number> {
  const interactions = await fetchUserInteractions(userId, date);
  return calculateTotalTime(interactions);
}

// gets and updates the activity for a user on a specific date/activity
async function getUpdatedActivity(activity: Activity): Promise<Activity> {
  if (!activity.completed) {
    const interactions = await fetchUserInteractions(
      activity.userId,
      activity.date
    );
    activity.seconds = calculateTotalTime(interactions);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activityDate = new Date(activity.date);
    activityDate.setHours(0, 0, 0, 0);

    // if the activity date is not today, mark it as completed
    if (activityDate.getTime() !== today.getTime()) {
      activity.completed = true;
    }

    updateActivity(activity).catch((error) => {
      errorLog('Error updating activity: ' + error);
    });
  }
  return activity;
}

async function updateActivity(activity: Activity) {
  return prismaLib.activity.update({
    where: {
      userId_date: {
        userId: activity.userId,
        date: activity.date,
      },
    },
    data: {
      seconds: activity.seconds,
      questions: activity.questions,
      completed: activity.completed,
    },
  });
}

type InteractionEvent = {
  event: string;
  id: number;
  context: Prisma.JsonValue;
  timestamp: Date;
};
