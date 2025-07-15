import { prismaLib } from "@/lib/prisma";
import {
  ForbiddenError,
  get200Response,
  get201Response,
  get400Response,
  get404Response,
  get409Response,
  UnknownServerError,
} from "@/utils/api-responses";
import { errorLog } from "@/utils/logger";
import { NotificationsAPI } from "@/utils/notifications-api";
import { GoalType, Prisma } from "@prisma/client";
import { secondsInHour } from "date-fns/constants";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(
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

  const { hours, questions, endDate } = await req.json().catch(() => {
    return get400Response("Invalid JSON body");
  });

  if ((!hours && !questions) || !endDate) {
    return get400Response(
      "You must provide either hours or questions, and an end date"
    );
  }

  if (hours && questions) {
    return get400Response("You cannot provide both hours and questions");
  }

  const parsedEndDate = new Date(endDate);

  if (parsedEndDate <= new Date()) {
    return get400Response("End date must be in the future");
  }

  try {
    const { goalType, value } = getGoalTypeAndValue(hours, questions);

    const goal = await prismaLib.goal.create({
      data: {
        userId,
        goalType,
        value,
        endDate: parsedEndDate,
      },
    });

    NotificationsAPI.postNotification(userId);

    return get201Response(goal);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" // Unique constraint failed (duplicate userId)
    ) {
      return get409Response("Goal already exists for this user");
    } else {
      errorLog("Unexpected error: " + error);
      return UnknownServerError;
    }
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);

  try {
    const goal = await prismaLib.goal.findUnique({
      where: { userId },
    });

    if (!goal) {
      return get404Response("No goal found for this user");
    }

    return get200Response(goal);
  } catch (error) {
    errorLog("Unexpected error while getting user goal: " + error);
    return UnknownServerError;
  }
}

export async function PUT(
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

  const { hours, questions, endDate } = await req.json().catch(() => {
    return get400Response("Invalid JSON body");
  });

  if ((!hours && !questions) || !endDate) {
    return get400Response(
      "You must provide either minutes or questions, and an end date"
    );
  }

  if (hours && questions) {
    return get400Response("You cannot provide both hours and questions");
  }

  const parsedEndDate = new Date(endDate);

  if (parsedEndDate <= new Date()) {
    return get400Response("End date must be in the future");
  }

  try {
    const { goalType, value } = getGoalTypeAndValue(hours, questions);

    const goal = await prismaLib.goal.update({
      where: { userId },
      data: {
        goalType,
        value,
        endDate: parsedEndDate,
      },
    });

    NotificationsAPI.postNotification(userId);

    return get200Response(goal);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025" // Record to update not found
    ) {
      return get400Response("No goal found for this user");
    } else {
      errorLog("Unexpected error while updating user goal: " + error);
      return UnknownServerError;
    }
  }
}

export async function DELETE(
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

  try {
    const goal = await prismaLib.goal.delete({
      where: { userId },
    });

    return get200Response(goal);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025" // Record to delete not found
    ) {
      return get400Response("No goal found for this user");
    } else {
      errorLog("Unexpected error while deleting goal: " + error);
      return UnknownServerError;
    }
  }
}

function getGoalTypeAndValue(hours?: number, questions?: number) {
  let goalType: GoalType;
  let value: number;

  if (hours) {
    goalType = "SECOND";
    value = hours * secondsInHour;
  } else {
    goalType = "QUESTION";
    value = questions!;
  }

  return { goalType, value };
}
