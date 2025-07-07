import { prismaLib } from "@/lib/prisma";
import {
  ForbiddenError,
  get200Response,
  get201Response,
  get400Response,
  get409Response,
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

  const { hours, questions, endDate } = await req.json().catch(() => {
    return get400Response("Invalid JSON body");
  });

  if ((!hours && !questions) || !endDate) {
    return get400Response(
      "You must provide either minutes or questions, and an end date"
    );
  }

  const parsedEndDate = new Date(endDate);

  if (parsedEndDate <= new Date()) {
    return get400Response("End date must be in the future");
  }

  try {
    const goal = await prismaLib.goal.create({
      data: {
        userId,
        seconds: hours * 60 * 60,
        questions,
        endDate: parsedEndDate,
      },
    });

    return get201Response(goal);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" // Unique constraint failed (duplicate userId)
    ) {
      return get409Response("Goal already exists for this user");
    } else {
      console.error("Unexpected error:", error);
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
      return get400Response("No goal found for this user");
    }

    return get200Response(goal);
  } catch (error) {
    console.error("Unexpected error:", error);
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

  const parsedEndDate = new Date(endDate);

  if (parsedEndDate <= new Date()) {
    return get400Response("End date must be in the future");
  }

  try {
    const goal = await prismaLib.goal.update({
      where: { userId },
      data: {
        seconds: hours * 60 * 60,
        questions,
        endDate: parsedEndDate,
      },
    });

    return get200Response(goal);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025" // Record to update not found
    ) {
      return get400Response("No goal found for this user");
    } else {
      console.error("Unexpected error:", error);
      return UnknownServerError;
    }
  }
}
