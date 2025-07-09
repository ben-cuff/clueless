import { prismaLib } from "@/lib/prisma";
import {
  get200Response,
  get201Response,
  get400Response,
  UnknownServerError,
} from "@/utils/api-responses";
import { errorLog } from "@/utils/logger";
import { Activity } from "@prisma/client";
import { millisecondsInSecond } from "date-fns/constants";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);

  if (isNaN(userId)) {
    return get400Response("Invalid user ID");
  }

  try {
    const activities = await prismaLib.activity.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: "desc",
      },
    });
    return get200Response(activities);
  } catch (error) {
    errorLog("Unexpected error: " + error);
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
    return get400Response("Invalid user ID");
  }

  const { questions, seconds } = await req.json().catch(() => {
    return get400Response("Invalid JSON body");
  });

  const currentDate = new Date();
  const activityDate = new Date(currentDate.toISOString().split("T")[0]); // Get the date without the time part

  let existingActivity;
  try {
    existingActivity = await prismaLib.activity.findUnique({
      where: {
        userId_date: {
          userId,
          date: activityDate,
        },
      },
    });
  } catch (error) {
    errorLog("Error fetching existing activity:" + error);
    return UnknownServerError;
  }

  const updatedSeconds = calculateUpdatedSeconds(seconds, existingActivity);

  const updatedQuestions =
    questions === true ? (existingActivity?.questions ?? 0) + 1 : undefined;

  const updateData = constructUpdateData(updatedSeconds, updatedQuestions);

  try {
    const activity = await prismaLib.activity.upsert({
      where: {
        userId_date: {
          userId,
          date: activityDate,
        },
      },
      update: updateData,
      create: {
        userId,
        date: activityDate,
        seconds: updatedSeconds,
        questions: updatedQuestions,
      },
    });

    const isNewRecord =
      activity.createdAt.getTime() === activity.updatedAt.getTime();

    return isNewRecord ? get201Response(activity) : get200Response(activity);
  } catch (error) {
    errorLog("Error adding activity: " + error);
    return UnknownServerError;
  }
}

function calculateUpdatedSeconds(
  seconds: number,
  existingActivity: Activity | null
): number | undefined {
  const DEFAULT_SECONDS = 0;
  const MAX_SECONDS = 120;

  if (seconds === undefined) {
    return undefined;
  }

  // if there is an existing activity, calculate the new seconds
  // by adding the time since the last update to the existing seconds
  // but limit the addition to a maximum of 120 seconds
  // if there is no existing activity, return the provided seconds
  if (existingActivity) {
    const now = new Date();
    const lastUpdate = new Date(existingActivity.updatedAt);

    // rounds up so that if the last update was less than a second ago, it still counts as 1 second
    // this is to prevent the case where the user updates their activity multiple times in a short
    // period of time and the seconds don't increase because the last update was too recent
    const diffInSeconds = Math.ceil(
      (now.getTime() - lastUpdate.getTime()) / millisecondsInSecond
    );

    const secondsToAdd = Math.min(diffInSeconds, MAX_SECONDS);
    return existingActivity.seconds + secondsToAdd;
  } else {
    if (isNaN(seconds) || seconds < 0) {
      return DEFAULT_SECONDS;
    }
    return Math.min(seconds, MAX_SECONDS);
  }
}

function constructUpdateData(
  updatedSeconds: number | undefined,
  updatedQuestions: number | undefined
): Partial<Activity> {
  const updateData: Partial<Activity> = {};
  if (updatedSeconds !== undefined) {
    updateData.seconds = updatedSeconds;
  }
  if (updatedQuestions !== undefined) {
    updateData.questions = updatedQuestions;
  }
  return updateData;
}
