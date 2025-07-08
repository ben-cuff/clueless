import { prismaLib } from "@/lib/prisma";
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
  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);

  if (isNaN(userId)) {
    return get400Response("Invalid user ID");
  }

  const session = await getServerSession(authOptions);

  if (session?.user.id !== userId) {
    return ForbiddenError;
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

  // Filters out activities that are before the goal's start date
  const filteredActivities = activityArray.filter(
    (activity) => new Date(activity.date) >= new Date(goal.beginAt)
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
    return notification;
  } else {
    return get200Response({ notify: false });
  }
}

function getTimeProgressPercentage(beginAt: Date, endDate: Date): number {
  const totalDuration = endDate.getTime() - beginAt.getTime();
  const elapsedDuration = new Date().getTime() - beginAt.getTime();
  return Math.max(0, Math.min(100, (elapsedDuration / totalDuration) * 100));
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
    return get200Response({ notify: true, message: "Goal completed!" });
  }

  if (progressPercentage < timeProgressPercentage - 10) {
    const message =
      type === "seconds"
        ? "You're falling behind on your study time goal!"
        : "You're falling behind on your questions goal!";
    return get200Response({ notify: true, message });
  }
}
