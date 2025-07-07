import { prismaLib } from "@/lib/prisma";
import {
  ForbiddenError,
  get200Response,
  get201Response,
  get400Response,
  UnknownServerError,
} from "@/utils/api-responses";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export default async function POST(
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

  const { questions, seconds } = await req.json().catch(() => {
    return get400Response("Invalid JSON body");
  });

  const data = new Date();
  const activityDate = new Date(data.toISOString().split("T")[0]);

  if (isNaN(activityDate.getTime())) {
    return get400Response("Invalid date format");
  }
  try {
    const existingActivity = await prismaLib.activity.findUnique({
      where: {
        userId_date: {
          userId,
          date: activityDate,
        },
      },
    });

    let updatedSeconds: number | undefined = undefined;

    if (seconds !== undefined && existingActivity) {
      const now = new Date();
      const lastUpdate = new Date(existingActivity.updatedAt);
      const diffInSeconds = 
        (now.getTime() - lastUpdate.getTime()) / 1000;

      const secondsToAdd = Math.min(diffInSeconds, 120);
      updatedSeconds = existingActivity.seconds + secondsToAdd;
    } else if (seconds !== undefined) {
      updatedSeconds = 0;
    }

    const updatedQuestions =
      questions === true ? (existingActivity?.questions ?? 0) + 1 : undefined;

    const activity = await prismaLib.activity.upsert({
      where: {
        userId_date: {
          userId,
          date: activityDate,
        },
      },
      update: {
        ...(updatedSeconds !== undefined && { seconds: updatedSeconds }),
        ...(updatedQuestions !== undefined && { questions: updatedQuestions }),
      },
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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return get400Response("Activity for this date and userId already exists");
    } else {
      console.error("Unexpected error:", error);
      return UnknownServerError;
    }
  }
}
